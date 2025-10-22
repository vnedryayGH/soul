"""
Интегрированный клиент провайдера модели с полной поддержкой
повторных попыток, мониторинга и обработки ошибок
"""

import asyncio
import logging
import time
from typing import Dict, Any, Optional, List
from contextlib import asynccontextmanager

# Импорты наших модулей
from model_provider_client import ModelProviderClient, ModelProviderConfig, ConnectionStatus
from retry_handler import RetryHandler, RetryConfig, BALANCED_RETRY
from monitoring import SystemMonitor, AlertLevel
from config import get_settings, validate_settings

import structlog


class IntegratedModelClient:
    """
    Интегрированный клиент с полной поддержкой надежности,
    мониторинга и диагностики
    """
    
    def __init__(self, config: Optional[ModelProviderConfig] = None):
        # Загружаем конфигурацию
        if config is None:
            settings = get_settings()
            if not validate_settings(settings):
                raise ValueError("Неверная конфигурация")
            
            config = ModelProviderConfig(
                primary_endpoint=settings.primary_endpoint,
                fallback_endpoints=settings.fallback_endpoints,
                api_key=settings.api_key,
                timeout=settings.timeout,
                max_retries=settings.max_retries
            )
        
        self.config = config
        self.client = ModelProviderClient(config)
        self.retry_handler = RetryHandler(BALANCED_RETRY)
        self.monitor = SystemMonitor(check_interval=30.0)
        self.logger = structlog.get_logger(__name__)
        
        # Статистика
        self.request_count = 0
        self.error_count = 0
        self.total_response_time = 0.0
        
        # Настраиваем мониторинг
        self._setup_monitoring()
    
    def _setup_monitoring(self):
        """Настройка системы мониторинга"""
        
        # Добавляем обработчики алертов
        async def connection_alert_handler(alert):
            self.logger.error("Алерт подключения", 
                            alert_id=alert.id, message=alert.message)
        
        async def performance_alert_handler(alert):
            self.logger.warning("Алерт производительности", 
                              alert_id=alert.id, message=alert.message)
        
        self.monitor.alert_manager.add_alert_handler(
            AlertLevel.ERROR, connection_alert_handler
        )
        self.monitor.alert_manager.add_alert_handler(
            AlertLevel.WARNING, performance_alert_handler
        )
        
        # Регистрируем кастомные проверки здоровья
        def error_rate_check():
            if self.request_count == 0:
                return 0.0
            return (self.error_count / self.request_count) * 100
        
        def avg_response_time_check():
            if self.request_count == 0:
                return 0.0
            return self.total_response_time / self.request_count
        
        self.monitor.health_checker.register_check(
            "client_error_rate", error_rate_check,
            warning_threshold=5.0, error_threshold=15.0
        )
        
        self.monitor.health_checker.register_check(
            "client_avg_response_time", avg_response_time_check,
            warning_threshold=2000, error_threshold=5000  # мс
        )
    
    async def start(self):
        """Запуск клиента и мониторинга"""
        self.logger.info("Запуск интегрированного клиента")
        
        # Запускаем мониторинг
        await self.monitor.start_monitoring()
        
        # Тестируем подключение
        success = await self._test_connection_with_retry()
        
        if success:
            self.logger.info("✅ Клиент успешно запущен и подключен")
        else:
            self.logger.error("❌ Не удалось установить подключение при запуске")
            await self.monitor.alert_manager.create_alert(
                alert_id="startup_connection_failed",
                level=AlertLevel.CRITICAL,
                message="Не удалось установить подключение при запуске клиента",
                component="integrated_client"
            )
        
        return success
    
    async def stop(self):
        """Остановка клиента и мониторинга"""
        self.logger.info("Остановка интегрированного клиента")
        
        await self.client.close()
        await self.monitor.stop_monitoring()
        
        self.logger.info("✅ Клиент остановлен")
    
    async def _test_connection_with_retry(self) -> bool:
        """Тестирование подключения с повторными попытками"""
        try:
            return await self.retry_handler.execute_with_retry(
                self.client.test_connection
            )
        except Exception as e:
            self.logger.error("Не удалось установить подключение", error=str(e))
            return False
    
    async def send_prompt_with_monitoring(self, prompt: str, model: str = None, 
                                        **kwargs) -> Dict[str, Any]:
        """
        Отправка промпта с полным мониторингом и обработкой ошибок
        """
        start_time = time.time()
        request_id = f"req_{int(time.time() * 1000)}"
        
        self.logger.info("Отправка промпта", 
                        request_id=request_id, model=model, prompt_length=len(prompt))
        
        # Записываем метрики
        self.monitor.metrics_collector.increment_counter("requests_total")
        self.request_count += 1
        
        try:
            # Используем модель по умолчанию если не указана
            if model is None:
                model = self.config.default_model if hasattr(self.config, 'default_model') else "gpt-3.5-turbo"
            
            # Выполняем запрос с повторными попытками
            async with self.retry_handler.retry_context():
                response = await self.retry_handler.execute_with_retry(
                    self.client.send_prompt, prompt, model, **kwargs
                )
            
            # Записываем успешные метрики
            duration = time.time() - start_time
            self.total_response_time += duration * 1000  # в мс
            
            self.monitor.metrics_collector.record_timer("request_duration", duration * 1000)
            self.monitor.metrics_collector.increment_counter("requests_success")
            
            self.logger.info("Промпт успешно обработан", 
                           request_id=request_id, duration_ms=duration * 1000)
            
            return {
                "success": True,
                "response": response,
                "request_id": request_id,
                "duration_ms": duration * 1000,
                "model": model
            }
            
        except Exception as e:
            # Записываем метрики ошибок
            duration = time.time() - start_time
            self.error_count += 1
            
            self.monitor.metrics_collector.record_timer("request_duration", duration * 1000)
            self.monitor.metrics_collector.increment_counter("requests_errors")
            
            self.logger.error("Ошибка при обработке промпта", 
                            request_id=request_id, error=str(e), duration_ms=duration * 1000)
            
            # Создаем алерт при критических ошибках
            if self.error_count > 5 or "authentication" in str(e).lower():
                await self.monitor.alert_manager.create_alert(
                    alert_id=f"request_error_{request_id}",
                    level=AlertLevel.ERROR,
                    message=f"Критическая ошибка при обработке запроса: {str(e)}",
                    component="integrated_client",
                    metadata={"request_id": request_id, "error": str(e)}
                )
            
            return {
                "success": False,
                "error": str(e),
                "request_id": request_id,
                "duration_ms": duration * 1000
            }
    
    async def get_models_with_monitoring(self) -> Dict[str, Any]:
        """Получение списка моделей с мониторингом"""
        start_time = time.time()
        
        try:
            async with self.retry_handler.retry_context():
                models = await self.retry_handler.execute_with_retry(
                    self.client.get_models
                )
            
            duration = time.time() - start_time
            self.monitor.metrics_collector.record_timer("get_models_duration", duration * 1000)
            
            self.logger.info("Список моделей получен", 
                           count=len(models), duration_ms=duration * 1000)
            
            return {
                "success": True,
                "models": models,
                "count": len(models),
                "duration_ms": duration * 1000
            }
            
        except Exception as e:
            duration = time.time() - start_time
            
            self.logger.error("Ошибка при получении списка моделей", 
                            error=str(e), duration_ms=duration * 1000)
            
            return {
                "success": False,
                "error": str(e),
                "duration_ms": duration * 1000
            }
    
    def get_client_status(self) -> Dict[str, Any]:
        """Получить полный статус клиента"""
        system_status = self.monitor.get_system_status()
        client_status = self.client.get_status()
        
        return {
            "client": {
                "status": client_status["status"],
                "current_endpoint": client_status["current_endpoint"],
                "primary_endpoint": client_status["primary_endpoint"],
                "fallback_endpoints": client_status["fallback_endpoints"]
            },
            "statistics": {
                "total_requests": self.request_count,
                "total_errors": self.error_count,
                "error_rate": (self.error_count / self.request_count * 100) if self.request_count > 0 else 0,
                "avg_response_time_ms": (self.total_response_time / self.request_count) if self.request_count > 0 else 0
            },
            "system": system_status,
            "retry_stats": self.retry_handler.statistics.to_dict()
        }
    
    @asynccontextmanager
    async def managed_session(self):
        """Контекстный менеджер для управляемой сессии"""
        try:
            success = await self.start()
            if not success:
                raise RuntimeError("Не удалось запустить клиент")
            
            yield self
            
        finally:
            await self.stop()


# Пример использования
async def example_usage():
    """Пример использования интегрированного клиента"""
    
    # Настраиваем логирование
    logging.basicConfig(level=logging.INFO)
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Используем клиент в управляемом контексте
    async with IntegratedModelClient().managed_session() as client:
        
        # Получаем список моделей
        models_result = await client.get_models_with_monitoring()
        print(f"📋 Модели: {models_result}")
        
        # Отправляем несколько промптов
        prompts = [
            "Привет! Как дела?",
            "Расскажи о машинном обучении",
            "Что такое Python?",
            "Объясни квантовую физику простыми словами"
        ]
        
        for i, prompt in enumerate(prompts):
            print(f"\n🤖 Промпт {i+1}: {prompt}")
            
            result = await client.send_prompt_with_monitoring(prompt)
            
            if result["success"]:
                print(f"✅ Ответ получен за {result['duration_ms']:.2f}мс")
                print(f"📝 Ответ: {result['response']}")
            else:
                print(f"❌ Ошибка: {result['error']}")
            
            # Небольшая пауза между запросами
            await asyncio.sleep(1)
        
        # Показываем финальный статус
        print(f"\n📊 Финальный статус клиента:")
        status = client.get_client_status()
        
        print(f"🔗 Подключение: {status['client']['status']}")
        print(f"📈 Статистика: {status['statistics']}")
        print(f"🏥 Здоровье системы: {status['system']['overall_status']}")
        
        # Показываем активные алерты
        active_alerts = status['system']['active_alerts']
        if active_alerts:
            print(f"🚨 Активные алерты: {len(active_alerts)}")
            for alert in active_alerts:
                print(f"  - {alert['level']}: {alert['message']}")
        else:
            print("✅ Активных алертов нет")


async def main():
    """Основная функция для демонстрации решения проблемы подключения"""
    
    print("🚀 Запуск решения проблемы подключения к провайдеру модели")
    print("=" * 60)
    
    try:
        await example_usage()
        print("\n✅ Демонстрация завершена успешно!")
        
    except Exception as e:
        print(f"\n❌ Ошибка при выполнении: {e}")
        
        # Показываем как можно диагностировать проблему
        print("\n🔍 Рекомендации по диагностике:")
        print("1. Проверьте API ключ в переменных окружения")
        print("2. Убедитесь что endpoints доступны")
        print("3. Проверьте сетевое подключение")
        print("4. Посмотрите логи для деталей ошибки")


if __name__ == "__main__":
    asyncio.run(main())
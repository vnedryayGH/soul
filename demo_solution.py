#!/usr/bin/env python3
"""
Демонстрация решения проблемы подключения к провайдеру модели
Request ID: 33c9ea15-3295-4407-88b8-2cc05574abea
"""

import asyncio
import sys
import os
import time
from typing import Dict, Any

# Добавляем путь для импорта
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from integrated_client import IntegratedModelClient
    from model_provider_client import ModelProviderConfig
    from config import get_settings, validate_settings
    import structlog
    import logging
except ImportError as e:
    print(f"❌ Ошибка импорта: {e}")
    print("Установите зависимости: pip install -r requirements.txt")
    sys.exit(1)


def setup_demo_logging():
    """Настройка логирования для демонстрации"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )


async def simulate_connection_problems():
    """Симуляция проблем с подключением для демонстрации решения"""
    
    print("🔧 Симуляция проблем с подключением к провайдеру модели...")
    print("=" * 60)
    
    # Создаем конфигурацию с недоступным основным endpoint для демонстрации
    config = ModelProviderConfig(
        primary_endpoint="https://unavailable-api.example.com",  # Недоступный endpoint
        fallback_endpoints=[
            "https://api.openai.com",  # Рабочий резервный endpoint (если есть ключ)
            "https://api.anthropic.com"
        ],
        api_key=os.getenv("MODEL_PROVIDER_API_KEY", "demo-key"),
        timeout=5.0,  # Короткий таймаут для быстрой демонстрации
        max_retries=3
    )
    
    print(f"📡 Основной endpoint: {config.primary_endpoint}")
    print(f"🔄 Резервные endpoints: {config.fallback_endpoints}")
    print(f"⏱️ Таймаут: {config.timeout}s")
    print(f"🔁 Максимум попыток: {config.max_retries}")
    
    # Создаем клиент
    client = IntegratedModelClient(config)
    
    print("\n🚀 Запуск клиента с обработкой проблем подключения...")
    
    try:
        # Демонстрируем автоматическое переключение на резервные endpoints
        start_time = time.time()
        
        success = await client.start()
        
        duration = time.time() - start_time
        
        if success:
            print(f"✅ Подключение установлено за {duration:.2f}s")
            
            # Показываем на какой endpoint подключились
            status = client.get_client_status()
            current_endpoint = status['client']['current_endpoint']
            
            if current_endpoint != config.primary_endpoint:
                print(f"🔄 Автоматически переключились на резервный endpoint: {current_endpoint}")
            else:
                print(f"📡 Используем основной endpoint: {current_endpoint}")
            
        else:
            print(f"❌ Не удалось подключиться за {duration:.2f}s")
            print("💡 Это ожидаемо, если нет валидного API ключа")
        
        return client, success
        
    except Exception as e:
        print(f"💥 Ошибка при подключении: {e}")
        return client, False


async def demonstrate_retry_mechanism(client: IntegratedModelClient):
    """Демонстрация механизма повторных попыток"""
    
    print("\n🔄 Демонстрация механизма повторных попыток...")
    print("-" * 40)
    
    # Попытаемся отправить промпт (может не сработать без валидного API ключа)
    test_prompts = [
        "Привет! Это тест подключения.",
        "Расскажи о надежности систем.",
        "Что такое retry mechanism?"
    ]
    
    for i, prompt in enumerate(test_prompts, 1):
        print(f"\n📝 Тест {i}: {prompt}")
        
        start_time = time.time()
        
        try:
            result = await client.send_prompt_with_monitoring(prompt)
            duration = time.time() - start_time
            
            if result["success"]:
                print(f"✅ Успех за {duration:.2f}s")
                response = str(result["response"])
                if len(response) > 100:
                    print(f"💬 Ответ: {response[:100]}...")
                else:
                    print(f"💬 Ответ: {response}")
            else:
                print(f"❌ Ошибка за {duration:.2f}s: {result['error']}")
                
        except Exception as e:
            duration = time.time() - start_time
            print(f"💥 Исключение за {duration:.2f}s: {e}")
        
        # Пауза между запросами
        await asyncio.sleep(0.5)


def show_solution_summary():
    """Показать резюме решения"""
    
    print("\n" + "=" * 60)
    print("📋 РЕЗЮМЕ РЕШЕНИЯ ПРОБЛЕМЫ ПОДКЛЮЧЕНИЯ")
    print("=" * 60)
    
    print("\n🎯 ПРОБЛЕМА:")
    print("   Временные проблемы с подключением к провайдеру модели")
    print("   Request ID: 33c9ea15-3295-4407-88b8-2cc05574abea")
    
    print("\n✅ РЕАЛИЗОВАННЫЕ РЕШЕНИЯ:")
    
    print("\n1. 🔄 МЕХАНИЗМ ПОВТОРНЫХ ПОПЫТОК:")
    print("   • Экспоненциальный backoff с джиттером")
    print("   • Настраиваемое количество попыток")
    print("   • Различные стратегии задержек")
    print("   • Умная обработка различных типов ошибок")
    
    print("\n2. 🔀 РЕЗЕРВНЫЕ ENDPOINTS:")
    print("   • Автоматическое переключение при сбоях")
    print("   • Поддержка множественных резервных серверов")
    print("   • Возврат к основному endpoint при восстановлении")
    
    print("\n3. 📊 МОНИТОРИНГ И ДИАГНОСТИКА:")
    print("   • Сбор метрик в реальном времени")
    print("   • Система алертов для критических ошибок")
    print("   • Детальное логирование для отладки")
    print("   • Проверки здоровья системы")
    
    print("\n4. ⚙️ ГИБКАЯ КОНФИГУРАЦИЯ:")
    print("   • Настройка через переменные окружения")
    print("   • Валидация конфигурации")
    print("   • Различные профили для разных сценариев")
    
    print("\n5. 🛡️ ОБРАБОТКА ОШИБОК:")
    print("   • Специализированные исключения")
    print("   • Graceful degradation")
    print("   • Информативные сообщения об ошибках")
    
    print("\n📁 СОЗДАННЫЕ ФАЙЛЫ:")
    files = [
        "model_provider_client.py - Базовый клиент с retry логикой",
        "retry_handler.py - Продвинутый обработчик повторов",
        "monitoring.py - Система мониторинга и алертов", 
        "config.py - Управление конфигурацией",
        "integrated_client.py - Интегрированное решение",
        "main.py - CLI для тестирования и диагностики",
        "requirements.txt - Зависимости проекта",
        ".env.example - Пример конфигурации",
        "test_client.py - Тесты для проверки работы"
    ]
    
    for file_desc in files:
        print(f"   • {file_desc}")
    
    print("\n🚀 БЫСТРЫЙ СТАРТ:")
    print("   1. pip install -r requirements.txt")
    print("   2. python main.py --create-env")
    print("   3. # Отредактируйте .env файл")
    print("   4. python main.py --test-connection")
    print("   5. python main.py --interactive")
    
    print("\n💡 ПРЕИМУЩЕСТВА РЕШЕНИЯ:")
    print("   ✓ Автоматическое восстановление после сбоев")
    print("   ✓ Высокая отказоустойчивость")
    print("   ✓ Детальная диагностика проблем")
    print("   ✓ Простота использования")
    print("   ✓ Готовность к продакшену")
    
    print("\n" + "=" * 60)


async def main():
    """Основная демонстрация решения"""
    
    setup_demo_logging()
    
    print("🎯 ДЕМОНСТРАЦИЯ РЕШЕНИЯ ПРОБЛЕМЫ ПОДКЛЮЧЕНИЯ К ПРОВАЙДЕРУ МОДЕЛИ")
    print("Request ID: 33c9ea15-3295-4407-88b8-2cc05574abea")
    print("=" * 70)
    
    try:
        # 1. Симулируем проблемы с подключением
        client, connection_success = await simulate_connection_problems()
        
        # 2. Демонстрируем retry механизм
        if connection_success:
            await demonstrate_retry_mechanism(client)
        else:
            print("\n💡 Демонстрация retry механизма пропущена (нет подключения)")
            print("   Для полной демонстрации укажите валидный API ключ в .env")
        
        # 3. Показываем статистику и статус
        print("\n📊 СТАТУС СИСТЕМЫ:")
        print("-" * 30)
        
        status = client.get_client_status()
        
        print(f"🔗 Статус подключения: {status['client']['status']}")
        print(f"📡 Текущий endpoint: {status['client']['current_endpoint']}")
        print(f"📈 Всего запросов: {status['statistics']['total_requests']}")
        print(f"❌ Ошибок: {status['statistics']['total_errors']}")
        
        if status['statistics']['total_requests'] > 0:
            print(f"📊 Процент ошибок: {status['statistics']['error_rate']:.2f}%")
            print(f"⏱️ Среднее время ответа: {status['statistics']['avg_response_time_ms']:.2f}мс")
        
        # Показываем активные алерты
        active_alerts = status['system']['active_alerts']
        if active_alerts:
            print(f"\n🚨 Активные алерты: {len(active_alerts)}")
            for alert in active_alerts[:3]:  # Показываем первые 3
                print(f"   • {alert['level']}: {alert['message']}")
        else:
            print("\n✅ Активных алертов нет")
        
        # Останавливаем клиент
        await client.stop()
        
        # 4. Показываем резюме решения
        show_solution_summary()
        
        print("\n🎉 ДЕМОНСТРАЦИЯ ЗАВЕРШЕНА УСПЕШНО!")
        print("\nТеперь проблемы с временными сбоями подключения к провайдеру модели")
        print("будут автоматически обрабатываться с помощью созданного решения.")
        
    except KeyboardInterrupt:
        print("\n👋 Демонстрация прервана пользователем")
    except Exception as e:
        print(f"\n💥 Ошибка в демонстрации: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Выход")
    except Exception as e:
        print(f"💥 Критическая ошибка: {e}")
        sys.exit(1)
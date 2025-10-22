#!/usr/bin/env python3
"""
Простые тесты для проверки работоспособности клиента провайдера модели
"""

import asyncio
import pytest
import sys
import os
from unittest.mock import AsyncMock, MagicMock, patch

# Добавляем путь для импорта модулей
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from model_provider_client import ModelProviderClient, ModelProviderConfig, ConnectionStatus
from retry_handler import RetryHandler, RetryConfig, RetryStrategy
from monitoring import MetricsCollector, HealthChecker, AlertManager, AlertLevel
from integrated_client import IntegratedModelClient


class TestModelProviderClient:
    """Тесты для базового клиента провайдера модели"""
    
    def test_config_creation(self):
        """Тест создания конфигурации"""
        config = ModelProviderConfig(
            primary_endpoint="https://api.test.com",
            fallback_endpoints=["https://api.backup.com"],
            api_key="test-key",
            timeout=30.0,
            max_retries=3
        )
        
        assert config.primary_endpoint == "https://api.test.com"
        assert config.api_key == "test-key"
        assert config.timeout == 30.0
        assert config.max_retries == 3
    
    def test_client_initialization(self):
        """Тест инициализации клиента"""
        config = ModelProviderConfig(
            primary_endpoint="https://api.test.com",
            fallback_endpoints=[],
            api_key="test-key"
        )
        
        client = ModelProviderClient(config)
        
        assert client.config == config
        assert client.status == ConnectionStatus.DISCONNECTED
        assert client.current_endpoint == config.primary_endpoint
    
    @pytest.mark.asyncio
    async def test_session_management(self):
        """Тест управления сессией"""
        config = ModelProviderConfig(
            primary_endpoint="https://api.test.com",
            fallback_endpoints=[],
            api_key="test-key"
        )
        
        client = ModelProviderClient(config)
        
        # Проверяем что сессия создается
        async with client.get_session() as session:
            assert session is not None
            assert not session.closed
        
        # Закрываем клиент
        await client.close()


class TestRetryHandler:
    """Тесты для обработчика повторных попыток"""
    
    def test_retry_config_creation(self):
        """Тест создания конфигурации повторных попыток"""
        config = RetryConfig(
            max_attempts=5,
            base_delay=1.0,
            strategy=RetryStrategy.EXPONENTIAL_BACKOFF
        )
        
        assert config.max_attempts == 5
        assert config.base_delay == 1.0
        assert config.strategy == RetryStrategy.EXPONENTIAL_BACKOFF
    
    def test_delay_calculation(self):
        """Тест вычисления задержки"""
        config = RetryConfig(
            max_attempts=5,
            base_delay=1.0,
            strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
            backoff_factor=2.0,
            jitter=False  # Отключаем джиттер для предсказуемости
        )
        
        handler = RetryHandler(config)
        
        # Тестируем экспоненциальный backoff
        assert handler._calculate_delay(1) == 1.0
        assert handler._calculate_delay(2) == 2.0
        assert handler._calculate_delay(3) == 4.0
    
    @pytest.mark.asyncio
    async def test_successful_execution(self):
        """Тест успешного выполнения без повторов"""
        config = RetryConfig(max_attempts=3, base_delay=0.1)
        handler = RetryHandler(config)
        
        async def success_func():
            return "success"
        
        result = await handler.execute_with_retry(success_func)
        assert result == "success"
        assert handler.statistics.total_attempts == 1
        assert handler.statistics.successful_attempts == 1
    
    @pytest.mark.asyncio
    async def test_retry_on_failure(self):
        """Тест повторных попыток при неудаче"""
        config = RetryConfig(max_attempts=3, base_delay=0.01)
        handler = RetryHandler(config)
        
        call_count = 0
        
        async def failing_func():
            nonlocal call_count
            call_count += 1
            if call_count < 3:
                raise ConnectionError("Temporary failure")
            return "success"
        
        result = await handler.execute_with_retry(failing_func)
        assert result == "success"
        assert call_count == 3
        assert handler.statistics.total_attempts == 3


class TestMonitoring:
    """Тесты для системы мониторинга"""
    
    def test_metrics_collector(self):
        """Тест сборщика метрик"""
        collector = MetricsCollector()
        
        # Тестируем счетчики
        collector.increment_counter("test_counter", 5)
        assert collector.get_counter("test_counter") == 5
        
        collector.increment_counter("test_counter", 3)
        assert collector.get_counter("test_counter") == 8
        
        # Тестируем датчики
        collector.set_gauge("test_gauge", 42.5)
        assert collector.get_gauge("test_gauge") == 42.5
        
        # Тестируем таймеры
        collector.record_timer("test_timer", 100.0)
        collector.record_timer("test_timer", 200.0)
        
        stats = collector.get_timer_stats("test_timer")
        assert stats["count"] == 2
        assert stats["min"] == 100.0
        assert stats["max"] == 200.0
        assert stats["avg"] == 150.0
    
    def test_health_checker(self):
        """Тест проверки здоровья"""
        collector = MetricsCollector()
        checker = HealthChecker(collector)
        
        # Регистрируем простую проверку
        def simple_check():
            return 50.0
        
        checker.register_check("test_check", simple_check, 
                              warning_threshold=75.0, error_threshold=90.0)
        
        assert "test_check" in checker.health_checks
    
    @pytest.mark.asyncio
    async def test_alert_manager(self):
        """Тест менеджера алертов"""
        manager = AlertManager()
        
        # Создаем алерт
        alert = await manager.create_alert(
            alert_id="test_alert",
            level=AlertLevel.WARNING,
            message="Test alert message",
            component="test_component"
        )
        
        assert alert.id == "test_alert"
        assert alert.level == AlertLevel.WARNING
        assert not alert.resolved
        
        # Проверяем что алерт активен
        active_alerts = manager.get_active_alerts()
        assert len(active_alerts) == 1
        assert active_alerts[0].id == "test_alert"
        
        # Разрешаем алерт
        manager.resolve_alert("test_alert")
        
        active_alerts = manager.get_active_alerts()
        assert len(active_alerts) == 0


class TestIntegratedClient:
    """Тесты для интегрированного клиента"""
    
    @patch('integrated_client.get_settings')
    @patch('integrated_client.validate_settings')
    def test_client_initialization_with_config(self, mock_validate, mock_get_settings):
        """Тест инициализации интегрированного клиента"""
        # Мокаем настройки
        mock_settings = MagicMock()
        mock_settings.primary_endpoint = "https://api.test.com"
        mock_settings.fallback_endpoints = []
        mock_settings.api_key = "test-key"
        mock_settings.timeout = 30.0
        mock_settings.max_retries = 5
        
        mock_get_settings.return_value = mock_settings
        mock_validate.return_value = True
        
        # Создаем клиент
        client = IntegratedModelClient()
        
        assert client.config.primary_endpoint == "https://api.test.com"
        assert client.config.api_key == "test-key"
        assert client.request_count == 0
        assert client.error_count == 0
    
    def test_client_with_custom_config(self):
        """Тест с кастомной конфигурацией"""
        config = ModelProviderConfig(
            primary_endpoint="https://custom.api.com",
            fallback_endpoints=["https://backup.api.com"],
            api_key="custom-key"
        )
        
        client = IntegratedModelClient(config)
        
        assert client.config == config
        assert client.config.primary_endpoint == "https://custom.api.com"


@pytest.mark.asyncio
async def test_integration_flow():
    """Интеграционный тест полного потока"""
    
    # Создаем конфигурацию для тестирования
    config = ModelProviderConfig(
        primary_endpoint="https://api.test.com",
        fallback_endpoints=["https://backup.test.com"],
        api_key="test-key",
        timeout=5.0,
        max_retries=2
    )
    
    # Создаем клиент
    client = IntegratedModelClient(config)
    
    # Проверяем что клиент создан корректно
    assert client.config == config
    assert client.request_count == 0
    assert client.error_count == 0
    
    # Проверяем статус
    status = client.get_client_status()
    
    assert "client" in status
    assert "statistics" in status
    assert "system" in status
    
    # Статистика должна быть пустой в начале
    stats = status["statistics"]
    assert stats["total_requests"] == 0
    assert stats["total_errors"] == 0
    assert stats["error_rate"] == 0


def run_tests():
    """Запуск всех тестов"""
    print("🧪 Запуск тестов клиента провайдера модели...")
    
    # Запускаем pytest
    exit_code = pytest.main([
        __file__,
        "-v",
        "--tb=short",
        "-x"  # Останавливаться на первой ошибке
    ])
    
    if exit_code == 0:
        print("✅ Все тесты прошли успешно!")
    else:
        print("❌ Некоторые тесты не прошли")
    
    return exit_code


if __name__ == "__main__":
    # Простой запуск тестов без pytest (для случая если pytest не установлен)
    import unittest
    
    print("🧪 Запуск базовых тестов...")
    
    try:
        # Тест создания конфигурации
        config = ModelProviderConfig(
            primary_endpoint="https://api.test.com",
            fallback_endpoints=[],
            api_key="test-key"
        )
        print("✅ Тест создания конфигурации: ПРОШЕЛ")
        
        # Тест создания клиента
        client = ModelProviderClient(config)
        print("✅ Тест создания клиента: ПРОШЕЛ")
        
        # Тест сборщика метрик
        collector = MetricsCollector()
        collector.increment_counter("test", 1)
        assert collector.get_counter("test") == 1
        print("✅ Тест сборщика метрик: ПРОШЕЛ")
        
        # Тест обработчика повторов
        retry_config = RetryConfig(max_attempts=3, base_delay=0.1)
        retry_handler = RetryHandler(retry_config)
        print("✅ Тест обработчика повторов: ПРОШЕЛ")
        
        print("\n🎉 Все базовые тесты прошли успешно!")
        
    except Exception as e:
        print(f"\n❌ Ошибка в тестах: {e}")
        import traceback
        traceback.print_exc()
"""
Конфигурация для клиента провайдера модели
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

# Загружаем переменные окружения из .env файла
load_dotenv()


class ModelProviderSettings(BaseSettings):
    """Настройки провайдера модели"""
    
    # Основные настройки подключения
    primary_endpoint: str = Field(
        default="https://api.openai.com",
        env="MODEL_PROVIDER_PRIMARY_ENDPOINT",
        description="Основной endpoint провайдера модели"
    )
    
    fallback_endpoints: List[str] = Field(
        default_factory=lambda: [
            "https://api.anthropic.com",
            "https://api.cohere.ai"
        ],
        env="MODEL_PROVIDER_FALLBACK_ENDPOINTS",
        description="Резервные endpoints"
    )
    
    api_key: str = Field(
        default="",
        env="MODEL_PROVIDER_API_KEY",
        description="API ключ для аутентификации"
    )
    
    # Настройки таймаутов и повторных попыток
    timeout: float = Field(
        default=30.0,
        env="MODEL_PROVIDER_TIMEOUT",
        description="Таймаут запроса в секундах"
    )
    
    max_retries: int = Field(
        default=5,
        env="MODEL_PROVIDER_MAX_RETRIES",
        description="Максимальное количество повторных попыток"
    )
    
    retry_delay: float = Field(
        default=1.0,
        env="MODEL_PROVIDER_RETRY_DELAY",
        description="Начальная задержка между попытками"
    )
    
    max_retry_delay: float = Field(
        default=60.0,
        env="MODEL_PROVIDER_MAX_RETRY_DELAY",
        description="Максимальная задержка между попытками"
    )
    
    backoff_factor: float = Field(
        default=2.0,
        env="MODEL_PROVIDER_BACKOFF_FACTOR",
        description="Коэффициент увеличения задержки"
    )
    
    # Настройки логирования
    log_level: str = Field(
        default="INFO",
        env="LOG_LEVEL",
        description="Уровень логирования"
    )
    
    log_format: str = Field(
        default="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        env="LOG_FORMAT",
        description="Формат логирования"
    )
    
    # Настройки модели по умолчанию
    default_model: str = Field(
        default="gpt-3.5-turbo",
        env="MODEL_PROVIDER_DEFAULT_MODEL",
        description="Модель по умолчанию"
    )
    
    default_temperature: float = Field(
        default=0.7,
        env="MODEL_PROVIDER_DEFAULT_TEMPERATURE",
        description="Температура по умолчанию"
    )
    
    default_max_tokens: int = Field(
        default=1000,
        env="MODEL_PROVIDER_DEFAULT_MAX_TOKENS",
        description="Максимальное количество токенов по умолчанию"
    )
    
    # Настройки мониторинга
    enable_metrics: bool = Field(
        default=True,
        env="MODEL_PROVIDER_ENABLE_METRICS",
        description="Включить сбор метрик"
    )
    
    health_check_interval: float = Field(
        default=60.0,
        env="MODEL_PROVIDER_HEALTH_CHECK_INTERVAL",
        description="Интервал проверки здоровья в секундах"
    )
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


def get_settings() -> ModelProviderSettings:
    """Получить настройки приложения"""
    return ModelProviderSettings()


def validate_settings(settings: ModelProviderSettings) -> bool:
    """Валидация настроек"""
    errors = []
    
    if not settings.api_key:
        errors.append("API ключ не установлен")
    
    if not settings.primary_endpoint:
        errors.append("Основной endpoint не установлен")
    
    if settings.timeout <= 0:
        errors.append("Таймаут должен быть больше 0")
    
    if settings.max_retries < 0:
        errors.append("Количество повторных попыток не может быть отрицательным")
    
    if errors:
        print("❌ Ошибки конфигурации:")
        for error in errors:
            print(f"  - {error}")
        return False
    
    return True


# Пример .env файла
ENV_EXAMPLE = """
# Настройки провайдера модели
MODEL_PROVIDER_PRIMARY_ENDPOINT=https://api.openai.com
MODEL_PROVIDER_FALLBACK_ENDPOINTS=["https://api.anthropic.com", "https://api.cohere.ai"]
MODEL_PROVIDER_API_KEY=your-api-key-here

# Настройки таймаутов
MODEL_PROVIDER_TIMEOUT=30.0
MODEL_PROVIDER_MAX_RETRIES=5
MODEL_PROVIDER_RETRY_DELAY=1.0
MODEL_PROVIDER_MAX_RETRY_DELAY=60.0
MODEL_PROVIDER_BACKOFF_FACTOR=2.0

# Настройки логирования
LOG_LEVEL=INFO

# Настройки модели
MODEL_PROVIDER_DEFAULT_MODEL=gpt-3.5-turbo
MODEL_PROVIDER_DEFAULT_TEMPERATURE=0.7
MODEL_PROVIDER_DEFAULT_MAX_TOKENS=1000

# Настройки мониторинга
MODEL_PROVIDER_ENABLE_METRICS=true
MODEL_PROVIDER_HEALTH_CHECK_INTERVAL=60.0
"""


if __name__ == "__main__":
    # Создаем пример .env файла если его нет
    if not os.path.exists(".env"):
        with open(".env", "w", encoding="utf-8") as f:
            f.write(ENV_EXAMPLE)
        print("✅ Создан файл .env с примером конфигурации")
    
    # Тестируем настройки
    settings = get_settings()
    if validate_settings(settings):
        print("✅ Конфигурация валидна")
        print(f"📡 Основной endpoint: {settings.primary_endpoint}")
        print(f"🔄 Резервные endpoints: {settings.fallback_endpoints}")
        print(f"⏱️ Таймаут: {settings.timeout}s")
        print(f"🔁 Максимум попыток: {settings.max_retries}")
    else:
        print("❌ Конфигурация содержит ошибки")
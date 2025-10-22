# Клиент провайдера модели с обработкой проблем подключения

Надежный клиент для подключения к провайдерам AI моделей с автоматическими повторными попытками, мониторингом и диагностикой проблем подключения.

## 🚀 Возможности

- **Автоматические повторные попытки** с различными стратегиями backoff
- **Резервные endpoints** для обеспечения отказоустойчивости  
- **Мониторинг в реальном времени** с метриками и алертами
- **Детальное логирование** для диагностики проблем
- **Гибкая конфигурация** через переменные окружения
- **Интерактивный режим** для тестирования

## 📦 Установка

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

2. Создайте файл конфигурации:
```bash
python main.py --create-env
```

3. Отредактируйте файл `.env` и укажите ваш API ключ:
```bash
MODEL_PROVIDER_API_KEY=your-api-key-here
```

## 🔧 Использование

### Быстрый старт

Тестирование подключения:
```bash
python main.py --test-connection
```

Полное тестирование системы:
```bash
python main.py --full-test
```

Интерактивный режим:
```bash
python main.py --interactive
```

### Доступные команды

- `--test-connection` - Тестирование подключения к провайдеру
- `--test-models` - Получение списка доступных моделей  
- `--test-prompts` - Тестирование отправки промптов
- `--interactive` - Интерактивный режим для живого тестирования
- `--full-test` - Полное тестирование всех функций
- `--status` - Детальный статус системы и метрики
- `--create-env` - Создание файла конфигурации .env

### Программное использование

```python
from integrated_client import IntegratedModelClient

async def example():
    # Создаем клиент с автоматической конфигурацией
    async with IntegratedModelClient().managed_session() as client:
        
        # Отправляем промпт с автоматическими повторными попытками
        result = await client.send_prompt_with_monitoring(
            "Расскажи о машинном обучении"
        )
        
        if result["success"]:
            print(f"Ответ: {result['response']}")
        else:
            print(f"Ошибка: {result['error']}")
        
        # Получаем статус системы
        status = client.get_client_status()
        print(f"Статус: {status}")
```

## ⚙️ Конфигурация

Основные параметры в файле `.env`:

```bash
# Подключение
MODEL_PROVIDER_PRIMARY_ENDPOINT=https://api.openai.com
MODEL_PROVIDER_API_KEY=your-api-key-here

# Повторные попытки
MODEL_PROVIDER_MAX_RETRIES=5
MODEL_PROVIDER_TIMEOUT=30.0

# Резервные endpoints
MODEL_PROVIDER_FALLBACK_ENDPOINTS=["https://api.anthropic.com"]
```

## 🔍 Диагностика проблем

### Частые проблемы и решения

**Ошибка аутентификации:**
- Проверьте правильность API ключа в `.env`
- Убедитесь что ключ активен и имеет необходимые права

**Таймауты подключения:**
- Увеличьте `MODEL_PROVIDER_TIMEOUT`
- Проверьте сетевое подключение
- Попробуйте резервные endpoints

**Превышение лимитов:**
- Проверьте лимиты вашего API ключа
- Увеличьте задержки между запросами
- Используйте другую модель

### Логи и мониторинг

Система автоматически собирает метрики:
- Количество успешных/неудачных запросов
- Время ответа
- Частота ошибок
- Статус здоровья endpoints

Просмотр детального статуса:
```bash
python main.py --status
```

## 📁 Структура проекта

```
├── main.py                    # Основной скрипт запуска
├── integrated_client.py       # Интегрированный клиент
├── model_provider_client.py   # Базовый клиент провайдера
├── retry_handler.py           # Обработчик повторных попыток  
├── monitoring.py              # Система мониторинга
├── config.py                  # Конфигурация
├── requirements.txt           # Зависимости
├── .env.example              # Пример конфигурации
└── README.md                 # Документация
```

## 🛠️ Разработка

Для разработки установите дополнительные зависимости:
```bash
pip install pytest pytest-asyncio black flake8 mypy
```

Запуск тестов:
```bash
pytest
```

Форматирование кода:
```bash
black .
```

## 📝 Примеры использования

### Базовое использование
```python
from integrated_client import IntegratedModelClient

client = IntegratedModelClient()
await client.start()

result = await client.send_prompt_with_monitoring("Привет!")
print(result)

await client.stop()
```

### С кастомной конфигурацией
```python
from model_provider_client import ModelProviderConfig
from integrated_client import IntegratedModelClient

config = ModelProviderConfig(
    primary_endpoint="https://api.openai.com",
    api_key="your-key",
    max_retries=3,
    timeout=15.0
)

client = IntegratedModelClient(config)
```

### Обработка ошибок
```python
try:
    result = await client.send_prompt_with_monitoring("Test prompt")
    if result["success"]:
        print(f"Success: {result['response']}")
    else:
        print(f"Error: {result['error']}")
except Exception as e:
    print(f"Critical error: {e}")
```

## 🤝 Поддержка

При возникновении проблем:

1. Проверьте логи с уровнем DEBUG:
   ```bash
   python main.py --test-connection --log-level DEBUG
   ```

2. Посмотрите статус системы:
   ```bash
   python main.py --status
   ```

3. Попробуйте интерактивный режим для диагностики:
   ```bash
   python main.py --interactive
   ```

---

**Примечание:** Этот клиент разработан специально для решения проблем с временными сбоями подключения к провайдерам AI моделей. Он автоматически обрабатывает большинство типичных ошибок и обеспечивает надежную работу даже при нестабильном соединении.


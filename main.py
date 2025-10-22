#!/usr/bin/env python3
"""
Основной скрипт для запуска и тестирования клиента провайдера модели
с обработкой проблем подключения
"""

import asyncio
import argparse
import sys
import os
import json
import logging
from typing import Optional

# Добавляем текущую директорию в путь для импорта модулей
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from integrated_client import IntegratedModelClient
    from config import get_settings, validate_settings, ENV_EXAMPLE
    from model_provider_client import ModelProviderConfig
    import structlog
except ImportError as e:
    print(f"❌ Ошибка импорта: {e}")
    print("Убедитесь, что все зависимости установлены: pip install -r requirements.txt")
    sys.exit(1)


def setup_logging(level: str = "INFO"):
    """Настройка логирования"""
    logging.basicConfig(
        level=getattr(logging, level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
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


async def test_connection(client: IntegratedModelClient) -> bool:
    """Тестирование подключения к провайдеру"""
    print("🔍 Тестирование подключения к провайдеру модели...")
    
    try:
        success = await client.start()
        
        if success:
            print("✅ Подключение успешно установлено!")
            
            # Получаем статус
            status = client.get_client_status()
            print(f"📡 Текущий endpoint: {status['client']['current_endpoint']}")
            print(f"🏥 Статус системы: {status['system']['overall_status']}")
            
            return True
        else:
            print("❌ Не удалось установить подключение")
            return False
            
    except Exception as e:
        print(f"💥 Ошибка при тестировании подключения: {e}")
        return False


async def test_models(client: IntegratedModelClient):
    """Тестирование получения списка моделей"""
    print("\n📋 Получение списка доступных моделей...")
    
    try:
        result = await client.get_models_with_monitoring()
        
        if result["success"]:
            models = result["models"]
            print(f"✅ Найдено {len(models)} моделей:")
            
            for i, model in enumerate(models[:5]):  # Показываем первые 5
                model_id = model.get('id', 'Unknown')
                print(f"  {i+1}. {model_id}")
            
            if len(models) > 5:
                print(f"  ... и еще {len(models) - 5} моделей")
                
        else:
            print(f"❌ Ошибка при получении моделей: {result['error']}")
            
    except Exception as e:
        print(f"💥 Ошибка при тестировании моделей: {e}")


async def test_prompts(client: IntegratedModelClient, prompts: list):
    """Тестирование отправки промптов"""
    print(f"\n🤖 Тестирование отправки {len(prompts)} промптов...")
    
    successful = 0
    failed = 0
    
    for i, prompt in enumerate(prompts, 1):
        print(f"\n📝 Промпт {i}: {prompt[:50]}{'...' if len(prompt) > 50 else ''}")
        
        try:
            result = await client.send_prompt_with_monitoring(prompt)
            
            if result["success"]:
                print(f"✅ Ответ получен за {result['duration_ms']:.2f}мс")
                
                # Показываем краткий ответ
                response_text = str(result["response"])
                if len(response_text) > 100:
                    print(f"💬 Ответ: {response_text[:100]}...")
                else:
                    print(f"💬 Ответ: {response_text}")
                
                successful += 1
            else:
                print(f"❌ Ошибка: {result['error']}")
                failed += 1
                
        except Exception as e:
            print(f"💥 Исключение: {e}")
            failed += 1
        
        # Пауза между запросами
        if i < len(prompts):
            await asyncio.sleep(1)
    
    print(f"\n📊 Результаты тестирования промптов:")
    print(f"  ✅ Успешных: {successful}")
    print(f"  ❌ Неудачных: {failed}")
    print(f"  📈 Успешность: {(successful / len(prompts) * 100):.1f}%")


async def show_detailed_status(client: IntegratedModelClient):
    """Показать детальный статус системы"""
    print("\n📊 Детальный статус системы:")
    print("=" * 50)
    
    status = client.get_client_status()
    
    # Статус клиента
    print("🔗 Статус подключения:")
    print(f"  Статус: {status['client']['status']}")
    print(f"  Текущий endpoint: {status['client']['current_endpoint']}")
    print(f"  Основной endpoint: {status['client']['primary_endpoint']}")
    print(f"  Резервные endpoints: {len(status['client']['fallback_endpoints'])}")
    
    # Статистика
    print("\n📈 Статистика запросов:")
    stats = status['statistics']
    print(f"  Всего запросов: {stats['total_requests']}")
    print(f"  Ошибок: {stats['total_errors']}")
    print(f"  Процент ошибок: {stats['error_rate']:.2f}%")
    print(f"  Среднее время ответа: {stats['avg_response_time_ms']:.2f}мс")
    
    # Здоровье системы
    print(f"\n🏥 Здоровье системы: {status['system']['overall_status']}")
    
    # Активные алерты
    active_alerts = status['system']['active_alerts']
    if active_alerts:
        print(f"\n🚨 Активные алерты ({len(active_alerts)}):")
        for alert in active_alerts:
            print(f"  - {alert['level']}: {alert['message']}")
    else:
        print("\n✅ Активных алертов нет")
    
    # Статистика повторных попыток
    retry_stats = status.get('retry_stats', {})
    if retry_stats.get('total_attempts', 0) > 0:
        print(f"\n🔄 Статистика повторных попыток:")
        print(f"  Всего попыток: {retry_stats['total_attempts']}")
        print(f"  Успешных: {retry_stats['successful_attempts']}")
        print(f"  Процент успеха: {retry_stats.get('success_rate', 0):.2f}%")


async def interactive_mode(client: IntegratedModelClient):
    """Интерактивный режим для тестирования"""
    print("\n🎮 Интерактивный режим")
    print("Введите 'exit' для выхода, 'status' для показа статуса")
    print("Или просто введите промпт для отправки модели")
    print("-" * 50)
    
    while True:
        try:
            prompt = input("\n💭 Ваш промпт: ").strip()
            
            if not prompt:
                continue
            
            if prompt.lower() == 'exit':
                print("👋 До свидания!")
                break
            
            if prompt.lower() == 'status':
                await show_detailed_status(client)
                continue
            
            print("🤖 Обрабатываю...")
            result = await client.send_prompt_with_monitoring(prompt)
            
            if result["success"]:
                print(f"✅ Ответ ({result['duration_ms']:.2f}мс):")
                print(f"💬 {result['response']}")
            else:
                print(f"❌ Ошибка: {result['error']}")
                
        except KeyboardInterrupt:
            print("\n👋 Выход по Ctrl+C")
            break
        except EOFError:
            print("\n👋 Выход")
            break


def create_env_file():
    """Создать файл .env с примером конфигурации"""
    env_path = ".env"
    
    if os.path.exists(env_path):
        print(f"⚠️  Файл {env_path} уже существует")
        return False
    
    with open(env_path, "w", encoding="utf-8") as f:
        f.write(ENV_EXAMPLE)
    
    print(f"✅ Создан файл {env_path} с примером конфигурации")
    print("📝 Отредактируйте его, указав ваш API ключ и настройки")
    return True


async def main():
    """Основная функция"""
    parser = argparse.ArgumentParser(
        description="Клиент провайдера модели с обработкой проблем подключения",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Примеры использования:
  python main.py --test-connection          # Тестирование подключения
  python main.py --test-models             # Тестирование получения моделей
  python main.py --test-prompts            # Тестирование промптов
  python main.py --interactive             # Интерактивный режим
  python main.py --full-test               # Полное тестирование
  python main.py --create-env              # Создать файл .env
  python main.py --status                  # Показать статус системы
        """
    )
    
    parser.add_argument("--test-connection", action="store_true",
                       help="Тестировать подключение к провайдеру")
    parser.add_argument("--test-models", action="store_true",
                       help="Тестировать получение списка моделей")
    parser.add_argument("--test-prompts", action="store_true",
                       help="Тестировать отправку промптов")
    parser.add_argument("--interactive", action="store_true",
                       help="Запустить в интерактивном режиме")
    parser.add_argument("--full-test", action="store_true",
                       help="Выполнить полное тестирование")
    parser.add_argument("--create-env", action="store_true",
                       help="Создать файл .env с примером конфигурации")
    parser.add_argument("--status", action="store_true",
                       help="Показать детальный статус системы")
    parser.add_argument("--log-level", default="INFO",
                       choices=["DEBUG", "INFO", "WARNING", "ERROR"],
                       help="Уровень логирования")
    
    args = parser.parse_args()
    
    # Настраиваем логирование
    setup_logging(args.log_level)
    
    # Создание файла .env
    if args.create_env:
        create_env_file()
        return
    
    print("🚀 Клиент провайдера модели с обработкой проблем подключения")
    print("=" * 60)
    
    # Проверяем конфигурацию
    try:
        settings = get_settings()
        if not validate_settings(settings):
            print("\n❌ Конфигурация содержит ошибки")
            print("💡 Создайте файл .env: python main.py --create-env")
            return
    except Exception as e:
        print(f"❌ Ошибка загрузки конфигурации: {e}")
        print("💡 Создайте файл .env: python main.py --create-env")
        return
    
    # Создаем клиент
    try:
        client = IntegratedModelClient()
    except Exception as e:
        print(f"❌ Ошибка создания клиента: {e}")
        return
    
    # Выполняем запрошенные действия
    try:
        if args.test_connection or args.full_test:
            success = await test_connection(client)
            if not success and not args.full_test:
                return
        
        if args.test_models or args.full_test:
            if not hasattr(client, '_started') or not client._started:
                await client.start()
            await test_models(client)
        
        if args.test_prompts or args.full_test:
            if not hasattr(client, '_started') or not client._started:
                await client.start()
            
            test_prompts_list = [
                "Привет! Как дела?",
                "Расскажи о машинном обучении кратко",
                "Что такое Python?",
                "Объясни квантовую физику простыми словами"
            ]
            await test_prompts(client, test_prompts_list)
        
        if args.status:
            if not hasattr(client, '_started') or not client._started:
                await client.start()
            await show_detailed_status(client)
        
        if args.interactive:
            if not hasattr(client, '_started') or not client._started:
                success = await test_connection(client)
                if not success:
                    print("❌ Не удалось подключиться для интерактивного режима")
                    return
            
            await interactive_mode(client)
        
        # Если никаких флагов не указано, показываем помощь
        if not any([args.test_connection, args.test_models, args.test_prompts,
                   args.interactive, args.full_test, args.status]):
            parser.print_help()
            
    except KeyboardInterrupt:
        print("\n👋 Прервано пользователем")
    except Exception as e:
        print(f"\n💥 Неожиданная ошибка: {e}")
    finally:
        # Останавливаем клиент
        try:
            await client.stop()
        except:
            pass


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Выход")
    except Exception as e:
        print(f"💥 Критическая ошибка: {e}")
        sys.exit(1)
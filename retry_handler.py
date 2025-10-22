"""
Специализированный обработчик повторных попыток для подключения к провайдеру модели
"""

import asyncio
import time
import random
from typing import Callable, Any, Optional, Dict, List
from dataclasses import dataclass, field
from enum import Enum
import logging
from contextlib import asynccontextmanager


class RetryStrategy(Enum):
    """Стратегии повторных попыток"""
    FIXED_DELAY = "fixed_delay"
    EXPONENTIAL_BACKOFF = "exponential_backoff"
    LINEAR_BACKOFF = "linear_backoff"
    FIBONACCI_BACKOFF = "fibonacci_backoff"


@dataclass
class RetryConfig:
    """Конфигурация для повторных попыток"""
    max_attempts: int = 5
    base_delay: float = 1.0
    max_delay: float = 60.0
    strategy: RetryStrategy = RetryStrategy.EXPONENTIAL_BACKOFF
    backoff_factor: float = 2.0
    jitter: bool = True
    jitter_range: float = 0.1
    timeout_per_attempt: float = 30.0
    
    # Условия для повторных попыток
    retry_on_exceptions: tuple = (
        ConnectionError,
        TimeoutError,
        OSError,
    )
    
    retry_on_status_codes: List[int] = field(default_factory=lambda: [
        408,  # Request Timeout
        429,  # Too Many Requests
        500,  # Internal Server Error
        502,  # Bad Gateway
        503,  # Service Unavailable
        504,  # Gateway Timeout
    ])


@dataclass
class RetryAttempt:
    """Информация о попытке подключения"""
    attempt_number: int
    start_time: float
    end_time: Optional[float] = None
    success: bool = False
    error: Optional[Exception] = None
    response_status: Optional[int] = None
    delay_before_next: Optional[float] = None


class RetryStatistics:
    """Статистика повторных попыток"""
    
    def __init__(self):
        self.attempts: List[RetryAttempt] = []
        self.total_attempts = 0
        self.successful_attempts = 0
        self.failed_attempts = 0
        self.total_delay_time = 0.0
        self.total_execution_time = 0.0
    
    def add_attempt(self, attempt: RetryAttempt):
        """Добавить информацию о попытке"""
        self.attempts.append(attempt)
        self.total_attempts += 1
        
        if attempt.success:
            self.successful_attempts += 1
        else:
            self.failed_attempts += 1
        
        if attempt.delay_before_next:
            self.total_delay_time += attempt.delay_before_next
        
        if attempt.end_time and attempt.start_time:
            self.total_execution_time += attempt.end_time - attempt.start_time
    
    def get_success_rate(self) -> float:
        """Получить процент успешных попыток"""
        if self.total_attempts == 0:
            return 0.0
        return (self.successful_attempts / self.total_attempts) * 100
    
    def get_average_attempt_time(self) -> float:
        """Получить среднее время попытки"""
        if self.total_attempts == 0:
            return 0.0
        return self.total_execution_time / self.total_attempts
    
    def to_dict(self) -> Dict[str, Any]:
        """Преобразовать статистику в словарь"""
        return {
            "total_attempts": self.total_attempts,
            "successful_attempts": self.successful_attempts,
            "failed_attempts": self.failed_attempts,
            "success_rate": self.get_success_rate(),
            "total_delay_time": self.total_delay_time,
            "total_execution_time": self.total_execution_time,
            "average_attempt_time": self.get_average_attempt_time(),
            "attempts": [
                {
                    "attempt_number": attempt.attempt_number,
                    "success": attempt.success,
                    "error": str(attempt.error) if attempt.error else None,
                    "response_status": attempt.response_status,
                    "duration": attempt.end_time - attempt.start_time if attempt.end_time else None,
                    "delay_before_next": attempt.delay_before_next
                }
                for attempt in self.attempts
            ]
        }


class RetryHandler:
    """Обработчик повторных попыток с различными стратегиями"""
    
    def __init__(self, config: RetryConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.statistics = RetryStatistics()
    
    def _calculate_delay(self, attempt_number: int) -> float:
        """Вычислить задержку перед следующей попыткой"""
        if self.config.strategy == RetryStrategy.FIXED_DELAY:
            delay = self.config.base_delay
        
        elif self.config.strategy == RetryStrategy.EXPONENTIAL_BACKOFF:
            delay = self.config.base_delay * (self.config.backoff_factor ** (attempt_number - 1))
        
        elif self.config.strategy == RetryStrategy.LINEAR_BACKOFF:
            delay = self.config.base_delay * attempt_number
        
        elif self.config.strategy == RetryStrategy.FIBONACCI_BACKOFF:
            delay = self.config.base_delay * self._fibonacci(attempt_number)
        
        else:
            delay = self.config.base_delay
        
        # Ограничиваем максимальной задержкой
        delay = min(delay, self.config.max_delay)
        
        # Добавляем джиттер для избежания thundering herd
        if self.config.jitter:
            jitter_amount = delay * self.config.jitter_range
            jitter = random.uniform(-jitter_amount, jitter_amount)
            delay = max(0, delay + jitter)
        
        return delay
    
    def _fibonacci(self, n: int) -> int:
        """Вычислить n-е число Фибоначчи"""
        if n <= 1:
            return n
        return self._fibonacci(n - 1) + self._fibonacci(n - 2)
    
    def _should_retry(self, attempt_number: int, exception: Optional[Exception] = None, 
                     status_code: Optional[int] = None) -> bool:
        """Определить, нужно ли повторить попытку"""
        
        # Проверяем максимальное количество попыток
        if attempt_number >= self.config.max_attempts:
            return False
        
        # Проверяем исключения
        if exception:
            if isinstance(exception, self.config.retry_on_exceptions):
                return True
            # Проверяем вложенные исключения
            if hasattr(exception, '__cause__') and exception.__cause__:
                return isinstance(exception.__cause__, self.config.retry_on_exceptions)
        
        # Проверяем статус коды
        if status_code and status_code in self.config.retry_on_status_codes:
            return True
        
        return False
    
    async def execute_with_retry(self, func: Callable, *args, **kwargs) -> Any:
        """
        Выполнить функцию с повторными попытками
        """
        attempt_number = 0
        last_exception = None
        
        while attempt_number < self.config.max_attempts:
            attempt_number += 1
            attempt = RetryAttempt(
                attempt_number=attempt_number,
                start_time=time.time()
            )
            
            try:
                self.logger.info(f"Попытка {attempt_number}/{self.config.max_attempts}")
                
                # Выполняем функцию с таймаутом
                if asyncio.iscoroutinefunction(func):
                    result = await asyncio.wait_for(
                        func(*args, **kwargs),
                        timeout=self.config.timeout_per_attempt
                    )
                else:
                    result = func(*args, **kwargs)
                
                # Успешное выполнение
                attempt.end_time = time.time()
                attempt.success = True
                self.statistics.add_attempt(attempt)
                
                self.logger.info(f"✅ Успешное выполнение на попытке {attempt_number}")
                return result
                
            except Exception as e:
                attempt.end_time = time.time()
                attempt.error = e
                last_exception = e
                
                # Проверяем статус код если это HTTP ошибка
                status_code = getattr(e, 'status', None) or getattr(e, 'code', None)
                attempt.response_status = status_code
                
                self.logger.warning(f"❌ Попытка {attempt_number} неудачна: {e}")
                
                # Проверяем, нужно ли повторить
                if not self._should_retry(attempt_number, e, status_code):
                    self.statistics.add_attempt(attempt)
                    self.logger.error(f"🚫 Прекращаем попытки после {attempt_number} попыток")
                    break
                
                # Вычисляем задержку перед следующей попыткой
                if attempt_number < self.config.max_attempts:
                    delay = self._calculate_delay(attempt_number)
                    attempt.delay_before_next = delay
                    
                    self.logger.info(f"⏳ Ждем {delay:.2f}s перед следующей попыткой")
                    await asyncio.sleep(delay)
                
                self.statistics.add_attempt(attempt)
        
        # Все попытки исчерпаны
        self.logger.error(f"💥 Все {self.config.max_attempts} попыток исчерпаны")
        
        if last_exception:
            raise last_exception
        else:
            raise RuntimeError(f"Не удалось выполнить операцию за {self.config.max_attempts} попыток")
    
    @asynccontextmanager
    async def retry_context(self):
        """Контекстный менеджер для повторных попыток"""
        start_time = time.time()
        try:
            yield self
        finally:
            end_time = time.time()
            self.logger.info(f"📊 Общее время выполнения: {end_time - start_time:.2f}s")
            self.logger.info(f"📈 Статистика: {self.statistics.to_dict()}")
    
    def reset_statistics(self):
        """Сбросить статистику"""
        self.statistics = RetryStatistics()


# Предустановленные конфигурации
AGGRESSIVE_RETRY = RetryConfig(
    max_attempts=10,
    base_delay=0.5,
    max_delay=30.0,
    strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
    backoff_factor=1.5,
    jitter=True
)

CONSERVATIVE_RETRY = RetryConfig(
    max_attempts=3,
    base_delay=2.0,
    max_delay=10.0,
    strategy=RetryStrategy.FIXED_DELAY,
    jitter=False
)

BALANCED_RETRY = RetryConfig(
    max_attempts=5,
    base_delay=1.0,
    max_delay=60.0,
    strategy=RetryStrategy.EXPONENTIAL_BACKOFF,
    backoff_factor=2.0,
    jitter=True
)


# Пример использования
async def example_unstable_function():
    """Пример нестабильной функции для тестирования"""
    import random
    
    if random.random() < 0.7:  # 70% вероятность неудачи
        raise ConnectionError("Временная ошибка подключения")
    
    return "Успешный результат!"


async def main():
    """Пример использования обработчика повторных попыток"""
    
    # Создаем обработчик с агрессивной стратегией
    retry_handler = RetryHandler(AGGRESSIVE_RETRY)
    
    async with retry_handler.retry_context():
        try:
            result = await retry_handler.execute_with_retry(example_unstable_function)
            print(f"🎉 Результат: {result}")
            
        except Exception as e:
            print(f"💥 Окончательная ошибка: {e}")
        
        # Показываем статистику
        stats = retry_handler.statistics.to_dict()
        print(f"📊 Статистика: {stats}")


if __name__ == "__main__":
    asyncio.run(main())
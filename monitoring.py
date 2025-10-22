"""
Система мониторинга и диагностики для клиента провайдера модели
"""

import asyncio
import time
import json
import logging
from typing import Dict, Any, List, Optional, Callable
from dataclasses import dataclass, field, asdict
from datetime import datetime, timedelta
from enum import Enum
from collections import defaultdict, deque
import structlog


class HealthStatus(Enum):
    """Статусы здоровья системы"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


class AlertLevel(Enum):
    """Уровни алертов"""
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


@dataclass
class HealthMetric:
    """Метрика здоровья системы"""
    name: str
    value: float
    unit: str
    timestamp: datetime = field(default_factory=datetime.now)
    status: HealthStatus = HealthStatus.UNKNOWN
    threshold_warning: Optional[float] = None
    threshold_error: Optional[float] = None
    
    def evaluate_status(self) -> HealthStatus:
        """Оценить статус на основе пороговых значений"""
        if self.threshold_error and self.value >= self.threshold_error:
            self.status = HealthStatus.UNHEALTHY
        elif self.threshold_warning and self.value >= self.threshold_warning:
            self.status = HealthStatus.DEGRADED
        else:
            self.status = HealthStatus.HEALTHY
        
        return self.status


@dataclass
class Alert:
    """Алерт о проблеме в системе"""
    id: str
    level: AlertLevel
    message: str
    component: str
    timestamp: datetime = field(default_factory=datetime.now)
    resolved: bool = False
    resolved_at: Optional[datetime] = None
    metadata: Dict[str, Any] = field(default_factory=dict)


class MetricsCollector:
    """Сборщик метрик производительности"""
    
    def __init__(self, max_history_size: int = 1000):
        self.max_history_size = max_history_size
        self.metrics_history: Dict[str, deque] = defaultdict(lambda: deque(maxlen=max_history_size))
        self.counters: Dict[str, int] = defaultdict(int)
        self.timers: Dict[str, List[float]] = defaultdict(list)
        self.gauges: Dict[str, float] = {}
    
    def increment_counter(self, name: str, value: int = 1, tags: Optional[Dict[str, str]] = None):
        """Увеличить счетчик"""
        key = self._make_key(name, tags)
        self.counters[key] += value
    
    def record_timer(self, name: str, duration: float, tags: Optional[Dict[str, str]] = None):
        """Записать время выполнения"""
        key = self._make_key(name, tags)
        self.timers[key].append(duration)
        
        # Ограничиваем размер истории
        if len(self.timers[key]) > self.max_history_size:
            self.timers[key] = self.timers[key][-self.max_history_size:]
    
    def set_gauge(self, name: str, value: float, tags: Optional[Dict[str, str]] = None):
        """Установить значение датчика"""
        key = self._make_key(name, tags)
        self.gauges[key] = value
    
    def add_metric(self, metric: HealthMetric):
        """Добавить метрику в историю"""
        self.metrics_history[metric.name].append(metric)
    
    def _make_key(self, name: str, tags: Optional[Dict[str, str]] = None) -> str:
        """Создать ключ для метрики с тегами"""
        if not tags:
            return name
        
        tag_str = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
        return f"{name}[{tag_str}]"
    
    def get_counter(self, name: str, tags: Optional[Dict[str, str]] = None) -> int:
        """Получить значение счетчика"""
        key = self._make_key(name, tags)
        return self.counters.get(key, 0)
    
    def get_timer_stats(self, name: str, tags: Optional[Dict[str, str]] = None) -> Dict[str, float]:
        """Получить статистику по таймеру"""
        key = self._make_key(name, tags)
        times = self.timers.get(key, [])
        
        if not times:
            return {}
        
        return {
            "count": len(times),
            "min": min(times),
            "max": max(times),
            "avg": sum(times) / len(times),
            "p50": self._percentile(times, 0.5),
            "p95": self._percentile(times, 0.95),
            "p99": self._percentile(times, 0.99)
        }
    
    def _percentile(self, data: List[float], percentile: float) -> float:
        """Вычислить перцентиль"""
        if not data:
            return 0.0
        
        sorted_data = sorted(data)
        index = int(percentile * (len(sorted_data) - 1))
        return sorted_data[index]
    
    def get_gauge(self, name: str, tags: Optional[Dict[str, str]] = None) -> Optional[float]:
        """Получить значение датчика"""
        key = self._make_key(name, tags)
        return self.gauges.get(key)
    
    def get_all_metrics(self) -> Dict[str, Any]:
        """Получить все метрики"""
        return {
            "counters": dict(self.counters),
            "gauges": dict(self.gauges),
            "timers": {k: self.get_timer_stats(k.split('[')[0], 
                                             self._parse_tags(k) if '[' in k else None) 
                      for k in self.timers.keys()}
        }
    
    def _parse_tags(self, key: str) -> Dict[str, str]:
        """Парсить теги из ключа"""
        if '[' not in key:
            return {}
        
        tag_part = key.split('[')[1].rstrip(']')
        tags = {}
        
        for tag in tag_part.split(','):
            if '=' in tag:
                k, v = tag.split('=', 1)
                tags[k] = v
        
        return tags


class HealthChecker:
    """Проверка здоровья системы"""
    
    def __init__(self, metrics_collector: MetricsCollector):
        self.metrics_collector = metrics_collector
        self.health_checks: Dict[str, Callable] = {}
        self.last_check_results: Dict[str, HealthMetric] = {}
        self.logger = structlog.get_logger(__name__)
    
    def register_check(self, name: str, check_func: Callable, 
                      warning_threshold: Optional[float] = None,
                      error_threshold: Optional[float] = None):
        """Зарегистрировать проверку здоровья"""
        self.health_checks[name] = check_func
        
        # Сохраняем пороговые значения
        if hasattr(check_func, '__annotations__'):
            check_func._warning_threshold = warning_threshold
            check_func._error_threshold = error_threshold
    
    async def run_health_check(self, name: str) -> HealthMetric:
        """Выполнить проверку здоровья"""
        if name not in self.health_checks:
            raise ValueError(f"Проверка {name} не зарегистрирована")
        
        check_func = self.health_checks[name]
        start_time = time.time()
        
        try:
            if asyncio.iscoroutinefunction(check_func):
                value = await check_func()
            else:
                value = check_func()
            
            duration = time.time() - start_time
            
            metric = HealthMetric(
                name=name,
                value=value,
                unit="ms" if name.endswith("_latency") else "count",
                threshold_warning=getattr(check_func, '_warning_threshold', None),
                threshold_error=getattr(check_func, '_error_threshold', None)
            )
            
            metric.evaluate_status()
            
            # Записываем метрики
            self.metrics_collector.record_timer(f"health_check_{name}", duration)
            self.metrics_collector.set_gauge(f"health_{name}", value)
            self.metrics_collector.add_metric(metric)
            
            self.last_check_results[name] = metric
            
            self.logger.info("Проверка здоровья выполнена", 
                           check=name, value=value, status=metric.status.value)
            
            return metric
            
        except Exception as e:
            duration = time.time() - start_time
            
            metric = HealthMetric(
                name=name,
                value=-1,
                unit="error",
                status=HealthStatus.UNHEALTHY
            )
            
            self.metrics_collector.record_timer(f"health_check_{name}", duration)
            self.metrics_collector.increment_counter(f"health_check_errors", tags={"check": name})
            
            self.logger.error("Ошибка при проверке здоровья", 
                            check=name, error=str(e))
            
            return metric
    
    async def run_all_checks(self) -> Dict[str, HealthMetric]:
        """Выполнить все проверки здоровья"""
        results = {}
        
        for name in self.health_checks:
            results[name] = await self.run_health_check(name)
        
        return results
    
    def get_overall_status(self) -> HealthStatus:
        """Получить общий статус здоровья"""
        if not self.last_check_results:
            return HealthStatus.UNKNOWN
        
        statuses = [metric.status for metric in self.last_check_results.values()]
        
        if HealthStatus.UNHEALTHY in statuses:
            return HealthStatus.UNHEALTHY
        elif HealthStatus.DEGRADED in statuses:
            return HealthStatus.DEGRADED
        elif all(status == HealthStatus.HEALTHY for status in statuses):
            return HealthStatus.HEALTHY
        else:
            return HealthStatus.UNKNOWN


class AlertManager:
    """Менеджер алертов"""
    
    def __init__(self, max_alerts: int = 1000):
        self.max_alerts = max_alerts
        self.alerts: deque = deque(maxlen=max_alerts)
        self.active_alerts: Dict[str, Alert] = {}
        self.alert_handlers: Dict[AlertLevel, List[Callable]] = defaultdict(list)
        self.logger = structlog.get_logger(__name__)
    
    def add_alert_handler(self, level: AlertLevel, handler: Callable):
        """Добавить обработчик алертов"""
        self.alert_handlers[level].append(handler)
    
    async def create_alert(self, alert_id: str, level: AlertLevel, 
                          message: str, component: str, 
                          metadata: Optional[Dict[str, Any]] = None) -> Alert:
        """Создать новый алерт"""
        alert = Alert(
            id=alert_id,
            level=level,
            message=message,
            component=component,
            metadata=metadata or {}
        )
        
        self.alerts.append(alert)
        self.active_alerts[alert_id] = alert
        
        self.logger.warning("Создан алерт", 
                          alert_id=alert_id, level=level.value, 
                          message=message, component=component)
        
        # Вызываем обработчики
        for handler in self.alert_handlers[level]:
            try:
                if asyncio.iscoroutinefunction(handler):
                    await handler(alert)
                else:
                    handler(alert)
            except Exception as e:
                self.logger.error("Ошибка в обработчике алерта", 
                                error=str(e), alert_id=alert_id)
        
        return alert
    
    def resolve_alert(self, alert_id: str):
        """Разрешить алерт"""
        if alert_id in self.active_alerts:
            alert = self.active_alerts[alert_id]
            alert.resolved = True
            alert.resolved_at = datetime.now()
            
            del self.active_alerts[alert_id]
            
            self.logger.info("Алерт разрешен", alert_id=alert_id)
    
    def get_active_alerts(self, level: Optional[AlertLevel] = None) -> List[Alert]:
        """Получить активные алерты"""
        alerts = list(self.active_alerts.values())
        
        if level:
            alerts = [alert for alert in alerts if alert.level == level]
        
        return sorted(alerts, key=lambda x: x.timestamp, reverse=True)
    
    def get_alert_summary(self) -> Dict[str, Any]:
        """Получить сводку по алертам"""
        active_by_level = defaultdict(int)
        
        for alert in self.active_alerts.values():
            active_by_level[alert.level.value] += 1
        
        return {
            "total_active": len(self.active_alerts),
            "by_level": dict(active_by_level),
            "total_historical": len(self.alerts)
        }


class SystemMonitor:
    """Основной монитор системы"""
    
    def __init__(self, check_interval: float = 60.0):
        self.check_interval = check_interval
        self.metrics_collector = MetricsCollector()
        self.health_checker = HealthChecker(self.metrics_collector)
        self.alert_manager = AlertManager()
        self.logger = structlog.get_logger(__name__)
        self.running = False
        self.monitor_task: Optional[asyncio.Task] = None
        
        # Регистрируем базовые проверки здоровья
        self._register_default_checks()
    
    def _register_default_checks(self):
        """Регистрация базовых проверок здоровья"""
        
        async def connection_latency_check():
            """Проверка задержки подключения"""
            # Имитация проверки задержки
            import random
            return random.uniform(10, 100)  # мс
        
        def error_rate_check():
            """Проверка частоты ошибок"""
            total_requests = self.metrics_collector.get_counter("requests_total")
            error_requests = self.metrics_collector.get_counter("requests_errors")
            
            if total_requests == 0:
                return 0.0
            
            return (error_requests / total_requests) * 100
        
        def memory_usage_check():
            """Проверка использования памяти"""
            import psutil
            return psutil.virtual_memory().percent
        
        self.health_checker.register_check(
            "connection_latency", connection_latency_check, 
            warning_threshold=50, error_threshold=100
        )
        
        self.health_checker.register_check(
            "error_rate", error_rate_check,
            warning_threshold=5.0, error_threshold=10.0
        )
        
        self.health_checker.register_check(
            "memory_usage", memory_usage_check,
            warning_threshold=80.0, error_threshold=95.0
        )
    
    async def start_monitoring(self):
        """Запустить мониторинг"""
        if self.running:
            return
        
        self.running = True
        self.monitor_task = asyncio.create_task(self._monitoring_loop())
        self.logger.info("Мониторинг запущен", interval=self.check_interval)
    
    async def stop_monitoring(self):
        """Остановить мониторинг"""
        self.running = False
        
        if self.monitor_task:
            self.monitor_task.cancel()
            try:
                await self.monitor_task
            except asyncio.CancelledError:
                pass
        
        self.logger.info("Мониторинг остановлен")
    
    async def _monitoring_loop(self):
        """Основной цикл мониторинга"""
        while self.running:
            try:
                # Выполняем проверки здоровья
                check_results = await self.health_checker.run_all_checks()
                
                # Проверяем на необходимость создания алертов
                for name, metric in check_results.items():
                    await self._check_for_alerts(name, metric)
                
                # Логируем общий статус
                overall_status = self.health_checker.get_overall_status()
                self.logger.info("Статус системы", status=overall_status.value)
                
                await asyncio.sleep(self.check_interval)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                self.logger.error("Ошибка в цикле мониторинга", error=str(e))
                await asyncio.sleep(self.check_interval)
    
    async def _check_for_alerts(self, check_name: str, metric: HealthMetric):
        """Проверить необходимость создания алертов"""
        alert_id = f"health_{check_name}"
        
        if metric.status == HealthStatus.UNHEALTHY:
            if alert_id not in self.alert_manager.active_alerts:
                await self.alert_manager.create_alert(
                    alert_id=alert_id,
                    level=AlertLevel.ERROR,
                    message=f"Проверка {check_name} показала критическое состояние: {metric.value}",
                    component="health_checker",
                    metadata={"metric": asdict(metric)}
                )
        
        elif metric.status == HealthStatus.DEGRADED:
            if alert_id not in self.alert_manager.active_alerts:
                await self.alert_manager.create_alert(
                    alert_id=alert_id,
                    level=AlertLevel.WARNING,
                    message=f"Проверка {check_name} показала деградацию: {metric.value}",
                    component="health_checker",
                    metadata={"metric": asdict(metric)}
                )
        
        elif metric.status == HealthStatus.HEALTHY:
            # Разрешаем алерт если он был активен
            if alert_id in self.alert_manager.active_alerts:
                self.alert_manager.resolve_alert(alert_id)
    
    def get_system_status(self) -> Dict[str, Any]:
        """Получить полный статус системы"""
        return {
            "overall_status": self.health_checker.get_overall_status().value,
            "health_checks": {
                name: asdict(metric) 
                for name, metric in self.health_checker.last_check_results.items()
            },
            "metrics": self.metrics_collector.get_all_metrics(),
            "alerts": self.alert_manager.get_alert_summary(),
            "active_alerts": [
                asdict(alert) for alert in self.alert_manager.get_active_alerts()
            ],
            "monitoring_active": self.running
        }


# Пример использования
async def main():
    """Пример использования системы мониторинга"""
    
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
    
    # Создаем монитор
    monitor = SystemMonitor(check_interval=10.0)
    
    # Добавляем обработчик критических алертов
    async def critical_alert_handler(alert: Alert):
        print(f"🚨 КРИТИЧЕСКИЙ АЛЕРТ: {alert.message}")
    
    monitor.alert_manager.add_alert_handler(AlertLevel.ERROR, critical_alert_handler)
    
    # Запускаем мониторинг
    await monitor.start_monitoring()
    
    # Имитируем работу системы
    for i in range(5):
        # Записываем некоторые метрики
        monitor.metrics_collector.increment_counter("requests_total")
        
        if i % 3 == 0:  # Иногда записываем ошибки
            monitor.metrics_collector.increment_counter("requests_errors")
        
        monitor.metrics_collector.record_timer("request_duration", i * 10)
        
        await asyncio.sleep(2)
    
    # Показываем статус системы
    status = monitor.get_system_status()
    print(f"📊 Статус системы:")
    print(json.dumps(status, indent=2, default=str, ensure_ascii=False))
    
    # Останавливаем мониторинг
    await monitor.stop_monitoring()


if __name__ == "__main__":
    asyncio.run(main())
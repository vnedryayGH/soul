"""
Модуль диагностики API сервера SoulPulse v2.6
Расширенный мониторинг, диагностика и исправление проблем
"""

import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from pathlib import Path

import psutil
from prometheus_client import Counter, Gauge, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi import HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .db import get_db_session
from .monitoring import logger

# Prometheus метрики
REQUEST_COUNT = Counter('soulpulse_requests_total', 'Total requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('soulpulse_request_duration_seconds', 'Request duration', ['method', 'endpoint'])
ERROR_COUNT = Counter('soulpulse_errors_total', 'Total errors', ['method', 'endpoint', 'error_type'])
ACTIVE_CONNECTIONS = Gauge('soulpulse_active_connections', 'Active database connections')
MEMORY_USAGE = Gauge('soulpulse_memory_bytes', 'Memory usage in bytes')
CPU_USAGE = Gauge('soulpulse_cpu_percent', 'CPU usage percentage')
DISK_USAGE = Gauge('soulpulse_disk_bytes', 'Disk usage in bytes')

# Dev Access health metrics
# Status: 1 — passed, 0 — failed
DEV_ACCESS_HEALTH_STATUS = Gauge('dev_access_health_status', 'Dev Access health status (1=passed, 0=failed)')
# Duration histogram (milliseconds)
DEV_ACCESS_HEALTH_DURATION_MS = Histogram('dev_access_health_ms', 'Dev Access health duration in milliseconds')


class APIDiagnostics:
    """Класс для диагностики и мониторинга API сервера"""
    
    def __init__(self):
        self.start_time = datetime.now()
        self.health_checks = {}
        self.performance_metrics = {}
        self.error_log = []
        self.last_cleanup = datetime.now()
        
    async def run_full_diagnostics(self, db: AsyncSession) -> Dict[str, Any]:
        """Запуск полной диагностики системы"""
        logger.info("Запуск полной диагностики API сервера")
        
        try:
            # Системная диагностика
            system_health = await self.check_system_health()
            
            # Диагностика базы данных
            database_health = await self.check_database_health(db)
            
            # Диагностика API эндпоинтов
            api_health = await self.check_api_endpoints()
            
            # Диагностика производительности
            performance_health = await self.check_performance()
            
            # Диагностика безопасности
            security_health = await self.check_security()
            
            # Общая оценка здоровья системы
            overall_health = self.calculate_overall_health([
                system_health, database_health, api_health, 
                performance_health, security_health
            ])
            
            # Очистка старых логов
            await self.cleanup_old_logs()
            
            return {
                "timestamp": datetime.now().isoformat(),
                "overall_health": overall_health,
                "system": system_health,
                "database": database_health,
                "api": api_health,
                "performance": performance_health,
                "security": security_health,
                "recommendations": self.generate_recommendations([
                    system_health, database_health, api_health, 
                    performance_health, security_health
                ])
            }
            
        except Exception as e:
            logger.error(f"Ошибка при выполнении диагностики: {e}")
            return {
                "timestamp": datetime.now().isoformat(),
                "overall_health": "critical",
                "error": str(e)
            }
    
    async def check_system_health(self) -> Dict[str, Any]:
        """Проверка здоровья системы"""
        try:
            # CPU
            cpu_percent = psutil.cpu_percent(interval=1)
            CPU_USAGE.set(cpu_percent)
            
            # Память
            memory = psutil.virtual_memory()
            MEMORY_USAGE.set(memory.used)
            
            # Диск
            disk = psutil.disk_usage('/')
            DISK_USAGE.set(disk.used)
            
            # Сетевые соединения
            network_connections = len(psutil.net_connections())
            
            # Процессы
            processes = len(psutil.pids())
            
            # Время работы системы
            boot_time = datetime.fromtimestamp(psutil.boot_time())
            uptime = datetime.now() - boot_time
            
            health_score = 100
            
            # Оценка CPU
            if cpu_percent > 90:
                health_score -= 30
                status = "warning"
            elif cpu_percent > 70:
                health_score -= 15
                status = "warning"
            else:
                status = "healthy"
            
            # Оценка памяти
            if memory.percent > 90:
                health_score -= 30
                status = "critical"
            elif memory.percent > 80:
                health_score -= 20
                status = "warning"
            
            # Оценка диска
            if disk.percent > 90:
                health_score -= 25
                status = "critical"
            elif disk.percent > 80:
                health_score -= 15
                status = "warning"
            
            return {
                "status": status,
                "health_score": max(0, health_score),
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_used_gb": round(memory.used / (1024**3), 2),
                "memory_total_gb": round(memory.total / (1024**3), 2),
                "disk_percent": disk.percent,
                "disk_used_gb": round(disk.used / (1024**3), 2),
                "disk_total_gb": round(disk.total / (1024**3), 2),
                "network_connections": network_connections,
                "processes": processes,
                "system_uptime": str(uptime).split('.')[0],
                "boot_time": boot_time.isoformat()
            }
            
        except Exception as e:
            logger.error(f"Ошибка при проверке здоровья системы: {e}")
            return {
                "status": "error",
                "health_score": 0,
                "error": str(e)
            }
    
    async def check_database_health(self, db: AsyncSession) -> Dict[str, Any]:
        """Расширенная проверка здоровья базы данных"""
        try:
            from sqlalchemy import text
            
            start_time = time.time()
            
            # Проверка соединения
            await db.execute(text("SELECT 1"))
            connection_time = time.time() - start_time
            
            # Количество активных соединений
            result = await db.execute(text("SELECT count(*) FROM pg_stat_activity"))
            active_connections = result.scalar()
            ACTIVE_CONNECTIONS.set(active_connections)
            
            # Проверка размера базы данных
            result = await db.execute(text("""
                SELECT pg_size_pretty(pg_database_size(current_database())) as size
            """))
            db_size = result.scalar()
            
            # Проверка медленных запросов
            result = await db.execute(text("""
                SELECT count(*) FROM pg_stat_activity 
                WHERE state = 'active' AND query_start < now() - interval '5 minutes'
            """))
            slow_queries = result.scalar()
            
            # Проверка блокировок
            result = await db.execute(text("""
                SELECT count(*) FROM pg_locks WHERE NOT granted
            """))
            blocked_queries = result.scalar()
            
            health_score = 100
            
            # Оценка времени соединения
            if connection_time > 1.0:
                health_score -= 30
                status = "warning"
            elif connection_time > 0.5:
                health_score -= 15
                status = "warning"
            else:
                status = "healthy"
            
            # Оценка активных соединений
            if active_connections > 100:
                health_score -= 25
                status = "warning"
            
            # Оценка медленных запросов
            if slow_queries > 10:
                health_score -= 20
                status = "warning"
            
            # Оценка блокировок
            if blocked_queries > 5:
                health_score -= 25
                status = "critical"
            
            return {
                "status": status,
                "health_score": max(0, health_score),
                "connection_time_ms": round(connection_time * 1000, 2),
                "active_connections": active_connections,
                "database_size": db_size,
                "slow_queries": slow_queries,
                "blocked_queries": blocked_queries,
                "last_check": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Ошибка при проверке здоровья базы данных: {e}")
            return {
                "status": "error",
                "health_score": 0,
                "error": str(e)
            }
    
    async def check_api_endpoints(self) -> Dict[str, Any]:
        """Проверка здоровья API эндпоинтов"""
        try:
            # Здесь можно добавить проверку доступности эндпоинтов
            # Пока возвращаем базовую информацию
            return {
                "status": "healthy",
                "health_score": 100,
                "total_endpoints": 15,  # Примерное количество
                "health_endpoint": "/api/health",
                "metrics_endpoint": "/api/metrics",
                "docs_endpoint": "/docs",
                "last_check": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Ошибка при проверке API эндпоинтов: {e}")
            return {
                "status": "error",
                "health_score": 0,
                "error": str(e)
            }
    
    async def check_performance(self) -> Dict[str, Any]:
        """Проверка производительности"""
        try:
            # Анализ времени ответа
            response_times = []
            if hasattr(self, 'performance_metrics') and 'response_times' in self.performance_metrics:
                response_times = self.performance_metrics['response_times']
            
            avg_response_time = sum(response_times) / len(response_times) if response_times else 0
            max_response_time = max(response_times) if response_times else 0
            
            # Оценка производительности
            health_score = 100
            
            if avg_response_time > 2.0:
                health_score -= 30
                status = "warning"
            elif avg_response_time > 1.0:
                health_score -= 15
                status = "warning"
            else:
                status = "healthy"
            
            if max_response_time > 10.0:
                health_score -= 20
                status = "warning"
            
            return {
                "status": status,
                "health_score": max(0, health_score),
                "avg_response_time_ms": round(avg_response_time * 1000, 2),
                "max_response_time_ms": round(max_response_time * 1000, 2),
                "total_requests": len(response_times),
                "last_check": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Ошибка при проверке производительности: {e}")
            return {
                "status": "error",
                "health_score": 0,
                "error": str(e)
            }
    
    async def check_security(self) -> Dict[str, Any]:
        """Проверка безопасности"""
        try:
            # Базовая проверка безопасности
            security_issues = []
            health_score = 100
            
            # Проверка переменных окружения
            import os
            if os.getenv("JWT_SECRET") == "change-me":
                security_issues.append("JWT_SECRET не изменен с дефолтного значения")
                health_score -= 30
            
            if os.getenv("DATABASE_URL", "").startswith("postgresql://"):
                security_issues.append("Используется небезопасное соединение с БД")
                health_score -= 20
            
            # Определение статуса
            if health_score < 50:
                status = "critical"
            elif health_score < 80:
                status = "warning"
            else:
                status = "healthy"
            
            return {
                "status": status,
                "health_score": max(0, health_score),
                "security_issues": security_issues,
                "total_issues": len(security_issues),
                "last_check": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Ошибка при проверке безопасности: {e}")
            return {
                "status": "error",
                "health_score": 0,
                "error": str(e)
            }
    
    def calculate_overall_health(self, health_checks: List[Dict[str, Any]]) -> str:
        """Вычисление общего здоровья системы"""
        if not health_checks:
            return "unknown"
        
        # Подсчет среднего health_score
        total_score = 0
        valid_checks = 0
        
        for check in health_checks:
            if 'health_score' in check and isinstance(check['health_score'], (int, float)):
                total_score += check['health_score']
                valid_checks += 1
        
        if valid_checks == 0:
            return "unknown"
        
        avg_score = total_score / valid_checks
        
        if avg_score >= 90:
            return "excellent"
        elif avg_score >= 80:
            return "good"
        elif avg_score >= 60:
            return "fair"
        elif avg_score >= 40:
            return "poor"
        else:
            return "critical"
    
    def generate_recommendations(self, health_checks: List[Dict[str, Any]]) -> List[str]:
        """Генерация рекомендаций по улучшению"""
        recommendations = []
        
        for check in health_checks:
            if check.get('status') == 'critical':
                if 'system' in str(check):
                    recommendations.append("Критическое состояние системы: проверьте CPU, память и диск")
                elif 'database' in str(check):
                    recommendations.append("Критическое состояние БД: проверьте соединения и блокировки")
                elif 'security' in str(check):
                    recommendations.append("Критические проблемы безопасности: обновите JWT_SECRET и настройки БД")
            
            elif check.get('status') == 'warning':
                if 'system' in str(check):
                    recommendations.append("Предупреждение системы: мониторьте ресурсы")
                elif 'database' in str(check):
                    recommendations.append("Предупреждение БД: оптимизируйте запросы")
                elif 'performance' in str(check):
                    recommendations.append("Предупреждение производительности: оптимизируйте время ответа")
        
        if not recommendations:
            recommendations.append("Система работает стабильно")
        
        return recommendations
    
    async def cleanup_old_logs(self):
        """Очистка старых логов"""
        try:
            current_time = datetime.now()
            if (current_time - self.last_cleanup).total_seconds() > 3600:  # Каждый час
                # Очистка старых записей
                cutoff_time = current_time - timedelta(days=7)
                
                # Очистка error_log
                self.error_log = [
                    error for error in self.error_log 
                    if error.get('timestamp', current_time) > cutoff_time
                ]
                
                # Очистка performance_metrics
                if 'response_times' in self.performance_metrics:
                    # Оставляем только последние 1000 записей
                    if len(self.performance_metrics['response_times']) > 1000:
                        self.performance_metrics['response_times'] = \
                            self.performance_metrics['response_times'][-1000:]
                
                self.last_cleanup = current_time
                logger.info("Очистка старых логов завершена")
                
        except Exception as e:
            logger.error(f"Ошибка при очистке логов: {e}")


# Глобальный экземпляр диагностики
api_diagnostics = APIDiagnostics()


async def get_diagnostics(db: AsyncSession = Depends(get_db_session)) -> Dict[str, Any]:
    """Получить результаты диагностики"""
    return await api_diagnostics.run_full_diagnostics(db)


async def get_prometheus_metrics() -> str:
    """Получить метрики в формате Prometheus"""
    return generate_latest()


# Экспорт основных компонентов
__all__ = [
    'APIDiagnostics',
    'api_diagnostics',
    'get_diagnostics',
    'get_prometheus_metrics',
    'REQUEST_COUNT',
    'REQUEST_DURATION',
    'ERROR_COUNT',
    'ACTIVE_CONNECTIONS',
    'MEMORY_USAGE',
    'CPU_USAGE',
    'DISK_USAGE'
]

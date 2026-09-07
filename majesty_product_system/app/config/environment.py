"""
Environment-specific configurations
"""

from .settings import Settings


class DevelopmentConfig:
    """Development environment configuration"""
    DEBUG = True
    LOG_LEVEL = "DEBUG"
    BACKUP_ENABLED = True
    AUTO_BACKUP_INTERVAL = 3600  # 1 hour


class ProductionConfig:
    """Production environment configuration"""
    DEBUG = False
    LOG_LEVEL = "INFO"
    BACKUP_ENABLED = True
    AUTO_BACKUP_INTERVAL = 86400  # 24 hours


def get_config(settings: Settings):
    """Get configuration based on environment"""
    if settings.is_production:
        return ProductionConfig
    return DevelopmentConfig

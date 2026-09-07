"""
Application Settings and Configuration
Loads settings from environment variables and .env file
"""

import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv


class Settings:
    """Application settings"""
    
    # Base paths
    BASE_DIR = Path(__file__).parent.parent.parent
    DATA_DIR = BASE_DIR / "data"
    LOG_DIR = BASE_DIR / "logs"
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: Optional[str] = os.getenv("DATABASE_URL")
    
    # Backup
    BACKUP_DIR = DATA_DIR / "backups"
    
    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FILE: str = LOG_DIR / "application.log"
    
    # API (for Next.js integration)
    NEXT_PUBLIC_APP_URL: str = os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000")
    API_BASE_URL: str = f"{NEXT_PUBLIC_APP_URL}/api"
    
    # Cloudinary (for image operations)
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET")
    
    # AI Provider (placeholder)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openai")
    AI_API_KEY: Optional[str] = os.getenv("AI_API_KEY")
    
    def __init__(self):
        """Initialize settings and create directories"""
        # Load .env file from parent directory (main project)
        env_file = self.BASE_DIR.parent / ".env"
        if env_file.exists():
            load_dotenv(env_file)
        else:
            # Try local .env file
            local_env = self.BASE_DIR / ".env"
            if local_env.exists():
                load_dotenv(local_env)
        
        # Create necessary directories
        self.DATA_DIR.mkdir(exist_ok=True)
        self.LOG_DIR.mkdir(exist_ok=True)
        self.BACKUP_DIR.mkdir(exist_ok=True)
        
        # Create subdirectories
        (self.DATA_DIR / "imports").mkdir(exist_ok=True)
        (self.DATA_DIR / "exports").mkdir(exist_ok=True)
        (self.DATA_DIR / "cache").mkdir(exist_ok=True)
        (self.DATA_DIR / "images").mkdir(exist_ok=True)
    
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.ENVIRONMENT.lower() == "development"
    
    def validate(self) -> bool:
        """Validate required settings"""
        if self.is_production and not self.DATABASE_URL:
            print("WARNING: DATABASE_URL not set in production")
            return False
        return True


# Global settings instance
settings = Settings()

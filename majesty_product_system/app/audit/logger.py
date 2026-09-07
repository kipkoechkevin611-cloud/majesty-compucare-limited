"""
Audit Logging System
Tracks all important operations for accountability and debugging
"""

import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
from enum import Enum


class AuditAction(Enum):
    """Audit action types"""
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    READ = "READ"
    IMPORT = "IMPORT"
    EXPORT = "EXPORT"
    SYNC = "SYNC"
    BACKUP = "BACKUP"
    RESTORE = "RESTORE"
    ERROR = "ERROR"


class AuditLogger:
    """Audit logger for tracking system operations"""
    
    def __init__(self, log_dir: Path):
        """
        Initialize audit logger
        
        Args:
            log_dir: Directory to store log files
        """
        self.log_dir = log_dir
        self.log_dir.mkdir(exist_ok=True)
        
        # Setup main application logger
        self.logger = logging.getLogger("majesty")
        self.logger.setLevel(logging.DEBUG)
        
        # File handler
        log_file = self.log_dir / "application.log"
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setLevel(logging.DEBUG)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
        
        # Audit log file (separate from application log)
        self.audit_log_file = self.log_dir / "audit.log"
    
    def log(self, action: AuditAction, entity_type: str, entity_id: Optional[str],
            user: str = "system", old_value: Optional[Any] = None,
            new_value: Optional[Any] = None, details: Optional[Dict] = None):
        """
        Log an audit event
        
        Args:
            action: Type of action performed
            entity_type: Type of entity (e.g., "product", "category")
            entity_id: ID of the entity
            user: User who performed the action
            old_value: Previous value (for updates)
            new_value: New value
            details: Additional details about the action
        """
        audit_entry = {
            "timestamp": datetime.now().isoformat(),
            "action": action.value,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "user": user,
            "old_value": self._serialize_value(old_value),
            "new_value": self._serialize_value(new_value),
            "details": details or {}
        }
        
        # Write to audit log
        try:
            with open(self.audit_log_file, 'a', encoding='utf-8') as f:
                f.write(json.dumps(audit_entry) + '\n')
        except Exception as e:
            self.logger.error(f"Failed to write audit log: {e}")
        
        # Also log to main logger
        log_message = f"{action.value} {entity_type}"
        if entity_id:
            log_message += f" (ID: {entity_id})"
        if user != "system":
            log_message += f" by {user}"
        
        if action == AuditAction.ERROR:
            self.logger.error(log_message)
        elif action in [AuditAction.DELETE, AuditAction.RESTORE]:
            self.logger.warning(log_message)
        else:
            self.logger.info(log_message)
    
    def log_create(self, entity_type: str, entity_id: str, data: Dict, user: str = "system"):
        """Log a create operation"""
        self.log(AuditAction.CREATE, entity_type, entity_id, user, new_value=data)
    
    def log_update(self, entity_type: str, entity_id: str, old_data: Dict, new_data: Dict, user: str = "system"):
        """Log an update operation"""
        self.log(AuditAction.UPDATE, entity_type, entity_id, user, old_value=old_data, new_value=new_data)
    
    def log_delete(self, entity_type: str, entity_id: str, data: Dict, user: str = "system"):
        """Log a delete operation"""
        self.log(AuditAction.DELETE, entity_type, entity_id, user, old_value=data)
    
    def log_import(self, source: str, count: int, details: Dict = None, user: str = "system"):
        """Log an import operation"""
        self.log(AuditAction.IMPORT, "import", None, user, details={
            "source": source,
            "count": count,
            **(details or {})
        })
    
    def log_export(self, destination: str, count: int, details: Dict = None, user: str = "system"):
        """Log an export operation"""
        self.log(AuditAction.EXPORT, "export", None, user, details={
            "destination": destination,
            "count": count,
            **(details or {})
        })
    
    def log_sync(self, entity_type: str, action: str, count: int, details: Dict = None, user: str = "system"):
        """Log a sync operation"""
        self.log(AuditAction.SYNC, entity_type, None, user, details={
            "action": action,
            "count": count,
            **(details or {})
        })
    
    def log_backup(self, backup_file: str, user: str = "system"):
        """Log a backup operation"""
        self.log(AuditAction.BACKUP, "backup", None, user, details={"file": backup_file})
    
    def log_restore(self, backup_file: str, user: str = "system"):
        """Log a restore operation"""
        self.log(AuditAction.RESTORE, "backup", None, user, details={"file": backup_file})
    
    def log_error(self, error: str, details: Dict = None):
        """Log an error"""
        self.log(AuditAction.ERROR, "error", None, details={"error": error, **(details or {})})
    
    def get_audit_log(self, limit: int = 100) -> list:
        """
        Retrieve recent audit log entries
        
        Args:
            limit: Maximum number of entries to return
            
        Returns:
            List of audit entries
        """
        entries = []
        
        try:
            with open(self.audit_log_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            # Get last N lines
            for line in lines[-limit:]:
                try:
                    entry = json.loads(line.strip())
                    entries.append(entry)
                except json.JSONDecodeError:
                    continue
        
        except FileNotFoundError:
            self.logger.warning("Audit log file not found")
        except Exception as e:
            self.logger.error(f"Failed to read audit log: {e}")
        
        return entries
    
    def _serialize_value(self, value: Any) -> Any:
        """Serialize value for JSON storage"""
        if value is None:
            return None
        elif isinstance(value, (str, int, float, bool)):
            return value
        elif isinstance(value, dict):
            return {k: self._serialize_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [self._serialize_value(item) for item in value]
        else:
            return str(value)

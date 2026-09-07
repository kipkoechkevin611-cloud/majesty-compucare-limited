"""
Database Backup and Restore Functionality
"""

import logging
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
from pymongo import MongoClient
from bson import ObjectId


logger = logging.getLogger(__name__)


class BackupManager:
    """Manages database backup and restore operations"""
    
    def __init__(self, db_connection, backup_dir: Path):
        """
        Initialize backup manager
        
        Args:
            db_connection: DatabaseConnection instance
            backup_dir: Directory to store backups
        """
        self.db_connection = db_connection
        self.backup_dir = backup_dir
        self.backup_dir.mkdir(exist_ok=True)
    
    def create_backup(self) -> Optional[str]:
        """
        Create a full database backup
        
        Returns:
            Path to backup file or None if failed
        """
        if not self.db_connection.is_connected():
            logger.error("Not connected to database")
            return None
        
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_file = self.backup_dir / f"backup_{timestamp}.json"
            
            logger.info(f"Creating backup: {backup_file}")
            
            db = self.db_connection.get_database()
            if not db:
                logger.error("Database not available")
                return None
            
            backup_data = {
                "timestamp": timestamp,
                "database": db.name,
                "collections": {}
            }
            
            # Backup all collections
            for collection_name in db.list_collection_names():
                collection = db[collection_name]
                documents = list(collection.find())
                
                # Convert ObjectId to string for JSON serialization
                backup_data["collections"][collection_name] = [
                    self._serialize_document(doc) for doc in documents
                ]
                
                logger.info(f"Backed up {len(documents)} documents from {collection_name}")
            
            # Write backup file
            with open(backup_file, 'w', encoding='utf-8') as f:
                json.dump(backup_data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Backup created successfully: {backup_file}")
            return str(backup_file)
            
        except Exception as e:
            logger.error(f"Failed to create backup: {e}")
            return None
    
    def restore_backup(self, backup_file: str, confirm: bool = False) -> bool:
        """
        Restore database from backup
        
        Args:
            backup_file: Path to backup file
            confirm: Must be True to proceed with restore
            
        Returns:
            True if restore successful, False otherwise
        """
        if not confirm:
            logger.error("Restore not confirmed - set confirm=True to proceed")
            return False
        
        if not self.db_connection.is_connected():
            logger.error("Not connected to database")
            return False
        
        backup_path = Path(backup_file)
        if not backup_path.exists():
            logger.error(f"Backup file not found: {backup_file}")
            return False
        
        try:
            logger.warning(f"Restoring from backup: {backup_path}")
            
            # Load backup data
            with open(backup_path, 'r', encoding='utf-8') as f:
                backup_data = json.load(f)
            
            db = self.db_connection.get_database()
            if not db:
                logger.error("Database not available")
                return False
            
            # Restore each collection
            for collection_name, documents in backup_data["collections"].items():
                collection = db[collection_name]
                
                # Clear existing documents
                collection.delete_many({})
                
                # Restore documents
                if documents:
                    # Convert string IDs back to ObjectId
                    restored_docs = [self._deserialize_document(doc) for doc in documents]
                    collection.insert_many(restored_docs)
                
                logger.info(f"Restored {len(documents)} documents to {collection_name}")
            
            logger.info(f"Restore completed successfully from: {backup_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to restore backup: {e}")
            return False
    
    def list_backups(self) -> list:
        """
        List all available backups
        
        Returns:
            List of backup file information
        """
        backups = []
        
        for backup_file in sorted(self.backup_dir.glob("backup_*.json")):
            try:
                with open(backup_file, 'r', encoding='utf-8') as f:
                    backup_data = json.load(f)
                
                backups.append({
                    "file": str(backup_file),
                    "timestamp": backup_data.get("timestamp"),
                    "database": backup_data.get("database"),
                    "collections": list(backup_data.get("collections", {}).keys()),
                    "size": backup_file.stat().st_size
                })
            except Exception as e:
                logger.error(f"Failed to read backup {backup_file}: {e}")
        
        return backups
    
    def delete_backup(self, backup_file: str) -> bool:
        """
        Delete a backup file
        
        Args:
            backup_file: Path to backup file
            
        Returns:
            True if deleted successfully, False otherwise
        """
        backup_path = Path(backup_file)
        
        if not backup_path.exists():
            logger.error(f"Backup file not found: {backup_file}")
            return False
        
        try:
            backup_path.unlink()
            logger.info(f"Deleted backup: {backup_file}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete backup {backup_file}: {e}")
            return False
    
    def _serialize_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert MongoDB document to JSON-serializable format"""
        serialized = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                serialized[key] = str(value)
            elif isinstance(value, dict):
                serialized[key] = self._serialize_document(value)
            elif isinstance(value, list):
                serialized[key] = [
                    self._serialize_document(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                serialized[key] = value
        return serialized
    
    def _deserialize_document(self, doc: Dict[str, Any]) -> Dict[str, Any]:
        """Convert JSON document back to MongoDB format"""
        deserialized = {}
        for key, value in doc.items():
            if key == "_id" and isinstance(value, str):
                deserialized[key] = ObjectId(value)
            elif isinstance(value, dict):
                deserialized[key] = self._deserialize_document(value)
            elif isinstance(value, list):
                deserialized[key] = [
                    self._deserialize_document(item) if isinstance(item, dict) else item
                    for item in value
                ]
            else:
                deserialized[key] = value
        return deserialized

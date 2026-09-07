"""
Database Connection Layer
Handles connection to MongoDB database
"""

import logging
from typing import Optional
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.collection import Collection


logger = logging.getLogger(__name__)


class DatabaseConnection:
    """MongoDB database connection manager"""
    
    def __init__(self, connection_string: Optional[str] = None):
        """
        Initialize database connection
        
        Args:
            connection_string: MongoDB connection string
        """
        self.connection_string = connection_string
        self.client: Optional[MongoClient] = None
        self.db: Optional[Database] = None
        self._connected = False
    
    def connect(self) -> bool:
        """
        Connect to MongoDB database
        
        Returns:
            bool: True if connection successful, False otherwise
        """
        if not self.connection_string:
            logger.warning("DATABASE_URL not set - using read-only mode")
            return False
        
        try:
            self.client = MongoClient(self.connection_string)
            # Test connection
            self.client.admin.command('ping')
            
            # Get database name from connection string
            db_name = self.connection_string.split('/')[-1].split('?')[0]
            self.db = self.client[db_name]
            
            self._connected = True
            logger.info(f"Connected to MongoDB database: {db_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {e}")
            self._connected = False
            return False
    
    def disconnect(self):
        """Disconnect from database"""
        if self.client:
            self.client.close()
            self._connected = False
            logger.info("Disconnected from MongoDB")
    
    def is_connected(self) -> bool:
        """Check if connected to database"""
        return self._connected
    
    def get_collection(self, collection_name: str) -> Optional[Collection]:
        """
        Get a collection from the database
        
        Args:
            collection_name: Name of the collection
            
        Returns:
            Collection object or None if not connected
        """
        if not self._connected or not self.db:
            logger.warning("Not connected to database")
            return None
        
        return self.db[collection_name]
    
    def get_database(self) -> Optional[Database]:
        """Get the database object"""
        return self.db
    
    def test_connection(self) -> bool:
        """Test database connection"""
        if not self._connected:
            return False
        
        try:
            self.client.admin.command('ping')
            return True
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            self._connected = False
            return False

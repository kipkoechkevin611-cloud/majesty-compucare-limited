"""
Product Repository
Data access layer for product operations
"""

import logging
from typing import Optional, List, Dict, Any
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

from .models import ProductModel, ProductCreate, ProductUpdate, CategoryModel


logger = logging.getLogger(__name__)


class ProductRepository:
    """Repository for product data access"""
    
    def __init__(self, db_connection):
        """
        Initialize product repository
        
        Args:
            db_connection: DatabaseConnection instance
        """
        self.db = db_connection.get_database()
        if not self.db:
            logger.error("Database not available")
    
    def get_collection(self):
        """Get products collection"""
        if not self.db:
            return None
        return self.db.get_collection("Product")
    
    def get_categories_collection(self):
        """Get categories collection"""
        if not self.db:
            return None
        return self.db.get_collection("Category")
    
    async def create(self, product: ProductCreate) -> Optional[ProductModel]:
        """
        Create a new product
        
        Args:
            product: Product data to create
            
        Returns:
            Created product or None if failed
        """
        try:
            collection = self.get_collection()
            if not collection:
                logger.error("Products collection not available")
                return None
            
            # Generate slug if not provided
            if not product.slug:
                product.slug = self._generate_slug(product.name)
            
            # Prepare document
            product_dict = product.model_dump(exclude={'id', 'created_at', 'updated_at'})
            product_dict['created_at'] = datetime.now()
            product_dict['updated_at'] = datetime.now()
            
            # Insert
            result = collection.insert_one(product_dict)
            
            if result.inserted_id:
                # Fetch created product
                created = await self.get_by_id(str(result.inserted_id))
                return created
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to create product: {e}")
            return None
    
    async def get_by_id(self, product_id: str) -> Optional[ProductModel]:
        """
        Get product by ID
        
        Args:
            product_id: Product ID
            
        Returns:
            Product or None if not found
        """
        try:
            collection = self.get_collection()
            if not collection:
                return None
            
            doc = collection.find_one({"_id": ObjectId(product_id)})
            
            if doc:
                return self._document_to_model(doc)
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get product {product_id}: {e}")
            return None
    
    async def get_by_slug(self, slug: str) -> Optional[ProductModel]:
        """
        Get product by slug
        
        Args:
            slug: Product slug
            
        Returns:
            Product or None if not found
        """
        try:
            collection = self.get_collection()
            if not collection:
                return None
            
            doc = collection.find_one({"slug": slug})
            
            if doc:
                return self._document_to_model(doc)
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get product by slug {slug}: {e}")
            return None
    
    async def list(self, skip: int = 0, limit: int = 50, 
                  category_id: Optional[str] = None,
                  status: Optional[str] = None,
                  search: Optional[str] = None) -> List[ProductModel]:
        """
        List products with filters
        
        Args:
            skip: Number of documents to skip
            limit: Maximum number of documents to return
            category_id: Filter by category
            status: Filter by status
            search: Search in name and description
            
        Returns:
            List of products
        """
        try:
            collection = self.get_collection()
            if not collection:
                return []
            
            # Build query
            query = {}
            
            if category_id:
                query['categoryId'] = category_id
            
            if status:
                query['status'] = status
            
            if search:
                query['$or'] = [
                    {'name': {'$regex': search, '$options': 'i'}},
                    {'description': {'$regex': search, '$options': 'i'}},
                    {'sku': {'$regex': search, '$options': 'i'}}
                ]
            
            # Execute query
            cursor = collection.find(query).skip(skip).limit(limit).sort('createdAt', -1)
            
            products = []
            for doc in cursor:
                product = self._document_to_model(doc)
                if product:
                    products.append(product)
            
            return products
            
        except Exception as e:
            logger.error(f"Failed to list products: {e}")
            return []
    
    async def update(self, product_id: str, product: ProductUpdate) -> Optional[ProductModel]:
        """
        Update an existing product
        
        Args:
            product_id: Product ID
            product: Updated product data
            
        Returns:
            Updated product or None if failed
        """
        try:
            collection = self.get_collection()
            if not collection:
                return None
            
            # Prepare update data
            update_data = product.model_dump(exclude_unset=True)
            update_data['updated_at'] = datetime.now()
            
            # Update
            result = collection.update_one(
                {"_id": ObjectId(product_id)},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                return await self.get_by_id(product_id)
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to update product {product_id}: {e}")
            return None
    
    async def delete(self, product_id: str) -> bool:
        """
        Delete a product
        
        Args:
            product_id: Product ID
            
        Returns:
            True if deleted, False otherwise
        """
        try:
            collection = self.get_collection()
            if not collection:
                return False
            
            result = collection.delete_one({"_id": ObjectId(product_id)})
            
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Failed to delete product {product_id}: {e}")
            return False
    
    async def count(self, category_id: Optional[str] = None,
                   status: Optional[str] = None) -> int:
        """
        Count products with filters
        
        Args:
            category_id: Filter by category
            status: Filter by status
            
        Returns:
            Number of products
        """
        try:
            collection = self.get_collection()
            if not collection:
                return 0
            
            query = {}
            
            if category_id:
                query['categoryId'] = category_id
            
            if status:
                query['status'] = status
            
            return collection.count_documents(query)
            
        except Exception as e:
            logger.error(f"Failed to count products: {e}")
            return 0
    
    async def get_categories(self) -> List[CategoryModel]:
        """
        Get all categories
        
        Returns:
            List of categories
        """
        try:
            collection = self.get_categories_collection()
            if not collection:
                return []
            
            cursor = collection.find()
            
            categories = []
            for doc in cursor:
                category = CategoryModel(
                    id=str(doc['_id']),
                    name=doc['name'],
                    slug=doc.get('slug'),
                    description=doc.get('description'),
                    image=doc.get('image'),
                    created_at=doc.get('createdAt'),
                    updated_at=doc.get('updatedAt')
                )
                categories.append(category)
            
            return categories
            
        except Exception as e:
            logger.error(f"Failed to get categories: {e}")
            return []
    
    def _document_to_model(self, doc: Dict[str, Any]) -> Optional[ProductModel]:
        """Convert MongoDB document to ProductModel"""
        try:
            return ProductModel(
                id=str(doc['_id']),
                name=doc['name'],
                slug=doc.get('slug'),
                description=doc['description'],
                short_description=doc.get('shortDescription'),
                category_id=doc['categoryId'],
                brand=doc.get('brand'),
                price=doc['price'],
                sale_price=doc.get('salePrice'),
                stock=doc.get('stock', 0),
                sku=doc.get('sku'),
                images=doc.get('images', []),
                featured=doc.get('featured', False),
                status=doc.get('status', 'ACTIVE'),
                specifications=doc.get('specifications'),
                source=doc.get('source', 'MANUAL'),
                source_url=doc.get('sourceUrl'),
                trend_score=doc.get('trendScore'),
                ai_generated=doc.get('aiGenerated', False),
                last_synced_at=doc.get('lastSyncedAt'),
                created_at=doc.get('createdAt'),
                updated_at=doc.get('updatedAt')
            )
        except Exception as e:
            logger.error(f"Failed to convert document to model: {e}")
            return None
    
    def _generate_slug(self, name: str) -> str:
        """Generate URL-friendly slug from name"""
        # Simple slug generation
        slug = name.lower()
        slug = slug.replace(' ', '-')
        slug = ''.join(c for c in slug if c.isalnum() or c == '-')
        return slug

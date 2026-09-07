"""
Product Service
Business logic layer for product operations
"""

import logging
from typing import Optional, List
from .models import ProductModel, ProductCreate, ProductUpdate, DuplicateDetectionResult
from .repository import ProductRepository
from .validators import ProductValidator
from ..audit.logger import AuditLogger, AuditAction


logger = logging.getLogger(__name__)


class ProductService:
    """Service layer for product business logic"""
    
    def __init__(self, repository: ProductRepository, 
                 validator: ProductValidator,
                 audit_logger: AuditLogger):
        """
        Initialize product service
        
        Args:
            repository: ProductRepository instance
            validator: ProductValidator instance
            audit_logger: AuditLogger instance
        """
        self.repository = repository
        self.validator = validator
        self.audit = audit_logger
    
    async def create_product(self, product: ProductCreate, 
                            user: str = "system",
                            check_duplicates: bool = True) -> tuple[Optional[ProductModel], List[str]]:
        """
        Create a new product with validation and duplicate checking
        
        Args:
            product: Product data to create
            user: User creating the product
            check_duplicates: Whether to check for duplicates
            
        Returns:
            Tuple of (created product or None, list of errors)
        """
        errors = []
        
        # Validate product
        is_valid, validation_errors = self.validator.validate_product(product)
        if not is_valid:
            errors.extend(validation_errors)
            return None, errors
        
        # Check for duplicates
        if check_duplicates:
            duplicate_result = await self.validator.detect_duplicate(product)
            if duplicate_result.is_duplicate:
                errors.append(f"Possible duplicate detected: {duplicate_result.matched_product.name}")
                errors.extend(duplicate_result.match_reasons)
                errors.extend(duplicate_result.suggestions)
                return None, errors
        
        # Create product
        created = await self.repository.create(product)
        
        if created:
            self.audit.log_create("product", str(created.id), product.model_dump(), user)
            logger.info(f"Created product: {created.name}")
            return created, []
        
        errors.append("Failed to create product")
        return None, errors
    
    async def get_product(self, product_id: str) -> Optional[ProductModel]:
        """
        Get a product by ID
        
        Args:
            product_id: Product ID
            
        Returns:
            Product or None if not found
        """
        product = await self.repository.get_by_id(product_id)
        if product:
            self.audit.log_read("product", product_id)
        return product
    
    async def list_products(self, skip: int = 0, limit: int = 50,
                          category_id: Optional[str] = None,
                          status: Optional[str] = None,
                          search: Optional[str] = None) -> List[ProductModel]:
        """
        List products with filters
        
        Args:
            skip: Number of products to skip
            limit: Maximum number of products to return
            category_id: Filter by category
            status: Filter by status
            search: Search in name and description
            
        Returns:
            List of products
        """
        return await self.repository.list(skip, limit, category_id, status, search)
    
    async def update_product(self, product_id: str, product: ProductUpdate,
                           user: str = "system") -> tuple[Optional[ProductModel], List[str]]:
        """
        Update an existing product
        
        Args:
            product_id: Product ID
            product: Updated product data
            user: User updating the product
            
        Returns:
            Tuple of (updated product or None, list of errors)
        """
        errors = []
        
        # Get existing product
        existing = await self.repository.get_by_id(product_id)
        if not existing:
            errors.append("Product not found")
            return None, errors
        
        # Update product
        updated = await self.repository.update(product_id, product)
        
        if updated:
            self.audit.log_update("product", product_id, 
                                existing.model_dump(), 
                                updated.model_dump(), 
                                user)
            logger.info(f"Updated product: {updated.name}")
            return updated, []
        
        errors.append("Failed to update product")
        return None, errors
    
    async def delete_product(self, product_id: str, user: str = "system",
                           confirm: bool = False) -> tuple[bool, List[str]]:
        """
        Delete a product (requires confirmation)
        
        Args:
            product_id: Product ID
            user: User deleting the product
            confirm: Must be True to proceed
            
        Returns:
            Tuple of (success, list of errors)
        """
        errors = []
        
        if not confirm:
            errors.append("Delete not confirmed - set confirm=True to proceed")
            return False, errors
        
        # Get existing product for audit
        existing = await self.repository.get_by_id(product_id)
        if not existing:
            errors.append("Product not found")
            return False, errors
        
        # Delete product
        success = await self.repository.delete(product_id)
        
        if success:
            self.audit.log_delete("product", product_id, existing.model_dump(), user)
            logger.info(f"Deleted product: {existing.name}")
            return True, []
        
        errors.append("Failed to delete product")
        return False, errors
    
    async def check_duplicates(self, product: ProductModel) -> DuplicateDetectionResult:
        """
        Check if a product is a duplicate
        
        Args:
            product: Product to check
            
        Returns:
            DuplicateDetectionResult
        """
        return await self.validator.detect_duplicate(product)
    
    async def get_product_quality(self, product_id: str) -> dict:
        """
        Get product quality score
        
        Args:
            product_id: Product ID
            
        Returns:
            Quality assessment dictionary
        """
        product = await self.repository.get_by_id(product_id)
        if not product:
            return {"error": "Product not found"}
        
        return self.validator.check_quality(product)
    
    async def get_categories(self) -> List:
        """
        Get all categories
        
        Returns:
            List of categories
        """
        return await self.repository.get_categories()
    
    async def count_products(self, category_id: Optional[str] = None,
                            status: Optional[str] = None) -> int:
        """
        Count products with filters
        
        Args:
            category_id: Filter by category
            status: Filter by status
            
        Returns:
            Number of products
        """
        return await self.repository.count(category_id, status)

"""
Product Validators
Validation and duplicate detection for products
"""

import logging
from typing import List, Optional
from difflib import SequenceMatcher
from .models import ProductModel, DuplicateDetectionResult


logger = logging.getLogger(__name__)


class ProductValidator:
    """Product validation and duplicate detection"""
    
    def __init__(self, repository):
        """
        Initialize product validator
        
        Args:
            repository: ProductRepository instance
        """
        self.repository = repository
    
    async def detect_duplicate(self, product: ProductModel) -> DuplicateDetectionResult:
        """
        Detect if a product is a duplicate of existing products
        
        Args:
            product: Product to check for duplicates
            
        Returns:
            DuplicateDetectionResult with confidence and matched product
        """
        try:
            # Get all existing products
            existing_products = await self.repository.list(limit=1000)
            
            if not existing_products:
                return DuplicateDetectionResult(
                    is_duplicate=False,
                    confidence=0.0,
                    matched_product=None,
                    match_reasons=[],
                    suggestions=[]
                )
            
            best_match = None
            best_confidence = 0.0
            match_reasons = []
            
            for existing in existing_products:
                confidence, reasons = self._calculate_similarity(product, existing)
                
                if confidence > best_confidence:
                    best_confidence = confidence
                    best_match = existing
                    match_reasons = reasons
            
            # Determine if it's a duplicate
            is_duplicate = best_confidence >= 0.8
            
            # Generate suggestions
            suggestions = []
            if is_duplicate:
                suggestions.append(f"Consider merging with existing product: {best_match.name}")
                suggestions.append("Check if this is the same product with different pricing")
            elif best_confidence >= 0.5:
                suggestions.append("Similar product exists - verify if this is a variant")
            
            return DuplicateDetectionResult(
                is_duplicate=is_duplicate,
                confidence=best_confidence,
                matched_product=best_match,
                match_reasons=match_reasons,
                suggestions=suggestions
            )
            
        except Exception as e:
            logger.error(f"Failed to detect duplicate: {e}")
            return DuplicateDetectionResult(
                is_duplicate=False,
                confidence=0.0,
                matched_product=None,
                match_reasons=[],
                suggestions=[]
            )
    
    def _calculate_similarity(self, product1: ProductModel, product2: ProductModel) -> tuple[float, List[str]]:
        """
        Calculate similarity between two products
        
        Args:
            product1: First product
            product2: Second product
            
        Returns:
            Tuple of (confidence score, list of match reasons)
        """
        confidence = 0.0
        reasons = []
        
        # Check SKU match (highest weight)
        if product1.sku and product2.sku and product1.sku == product2.sku:
            confidence += 0.4
            reasons.append("SKU matches")
        
        # Check name similarity (high weight)
        name_similarity = SequenceMatcher(None, product1.name.lower(), product2.name.lower()).ratio()
        if name_similarity >= 0.8:
            confidence += 0.3
            reasons.append(f"Name similarity: {name_similarity:.2%}")
        elif name_similarity >= 0.6:
            confidence += 0.15
            reasons.append(f"Name similarity: {name_similarity:.2%}")
        
        # Check brand match (medium weight)
        if product1.brand and product2.brand and product1.brand.lower() == product2.brand.lower():
            confidence += 0.15
            reasons.append("Brand matches")
        
        # Check price similarity (medium weight)
        if product1.price and product2.price:
            price_diff = abs(product1.price - product2.price) / max(product1.price, product2.price)
            if price_diff < 0.1:  # Within 10%
                confidence += 0.1
                reasons.append("Price similar")
            elif price_diff < 0.2:  # Within 20%
                confidence += 0.05
                reasons.append("Price somewhat similar")
        
        # Check category match (low weight)
        if product1.category_id == product2.category_id:
            confidence += 0.05
            reasons.append("Same category")
        
        return min(confidence, 1.0), reasons
    
    def validate_product(self, product: ProductModel) -> tuple[bool, List[str]]:
        """
        Validate product data
        
        Args:
            product: Product to validate
            
        Returns:
            Tuple of (is_valid, list of validation errors)
        """
        errors = []
        
        # Required fields
        if not product.name or len(product.name) < 3:
            errors.append("Product name must be at least 3 characters")
        
        if not product.description or len(product.description) < 10:
            errors.append("Product description must be at least 10 characters")
        
        if not product.category_id:
            errors.append("Product must have a category")
        
        if not product.price or product.price <= 0:
            errors.append("Product must have a valid price")
        
        # Validate sale price
        if product.sale_price and product.sale_price >= product.price:
            errors.append("Sale price must be less than regular price")
        
        # Validate stock
        if product.stock < 0:
            errors.append("Stock cannot be negative")
        
        # Validate images
        if not product.images:
            errors.append("Product should have at least one image")
        
        # Validate status
        if product.status == "OUT_OF_STOCK" and product.stock > 0:
            errors.append("Product marked as OUT_OF_STOCK but has stock")
        
        return len(errors) == 0, errors
    
    def check_quality(self, product: ProductModel) -> dict:
        """
        Check product quality/completeness
        
        Args:
            product: Product to check
            
        Returns:
            Dictionary with quality score and missing fields
        """
        missing_fields = []
        score = 100
        
        # Check required fields
        if not product.name:
            missing_fields.append("name")
            score -= 20
        
        if not product.description:
            missing_fields.append("description")
            score -= 15
        
        if not product.category_id:
            missing_fields.append("category")
            score -= 10
        
        if not product.price:
            missing_fields.append("price")
            score -= 15
        
        # Check recommended fields
        if not product.brand:
            missing_fields.append("brand")
            score -= 5
        
        if not product.sku:
            missing_fields.append("sku")
            score -= 5
        
        if not product.short_description:
            missing_fields.append("short_description")
            score -= 5
        
        if not product.images:
            missing_fields.append("images")
            score -= 10
        
        if not product.specifications:
            missing_fields.append("specifications")
            score -= 5
        
        # Check status consistency
        if product.status == "OUT_OF_STOCK" and product.stock > 0:
            missing_fields.append("status/stock mismatch")
            score -= 5
        
        return {
            "score": max(0, score),
            "missing_fields": missing_fields,
            "is_complete": score >= 90
        }

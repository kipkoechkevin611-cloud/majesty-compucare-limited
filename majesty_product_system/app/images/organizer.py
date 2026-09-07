"""
Image Organizer
Organizes product images with naming conventions and metadata
"""

import logging
import re
from pathlib import Path
from typing import Optional, List, Dict, Any
from .manager import ImageManager


logger = logging.getLogger(__name__)


class ImageOrganizer:
    """Organizes product images with consistent naming"""
    
    def __init__(self, image_manager: ImageManager):
        """
        Initialize image organizer
        
        Args:
            image_manager: ImageManager instance
        """
        self.manager = image_manager
        self.images_dir = image_manager.images_dir
    
    def generate_filename(self, brand: Optional[str], model: Optional[str],
                         variant: Optional[str] = None) -> str:
        """
        Generate standardized filename for product image
        
        Args:
            brand: Product brand
            model: Product model
            variant: Product variant (optional)
            
        Returns:
            Standardized filename
        """
        parts = []
        
        if brand:
            parts.append(brand.lower().replace(' ', '_'))
        
        if model:
            # Clean model name
            model_clean = re.sub(r'[^\w\s-]', '', model)
            model_clean = model_clean.lower().replace(' ', '_')
            parts.append(model_clean)
        
        if variant:
            variant_clean = re.sub(r'[^\w\s-]', '', variant)
            variant_clean = variant_clean.lower().replace(' ', '_')
            parts.append(variant_clean)
        
        if not parts:
            return "unnamed_product"
        
        filename = "_".join(parts)
        return f"{filename}.jpg"
    
    def organize_by_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Organize images for a specific product
        
        Args:
            product_data: Product data with images
            
        Returns:
            Organization results
        """
        results = {
            "product_id": product_data.get("id"),
            "product_name": product_data.get("name"),
            "images_processed": 0,
            "images_renamed": 0,
            "errors": []
        }
        
        try:
            brand = product_data.get("brand")
            model = product_data.get("name")  # Use name as model if not specified
            images = product_data.get("images", [])
            
            for i, image_url in enumerate(images):
                try:
                    # Generate new filename
                    variant = f"image_{i+1}" if i > 0 else None
                    new_filename = self.generate_filename(brand, model, variant)
                    
                    # In production, this would rename Cloudinary images
                    # For now, just log the suggested name
                    logger.info(f"Suggested filename for image {i+1}: {new_filename}")
                    results["images_processed"] += 1
                    
                except Exception as e:
                    logger.error(f"Failed to organize image {i}: {e}")
                    results["errors"].append(str(e))
            
        except Exception as e:
            logger.error(f"Failed to organize product images: {e}")
            results["errors"].append(str(e))
        
        return results
    
    def batch_organize(self, products: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Organize images for multiple products
        
        Args:
            products: List of product data
            
        Returns:
            Batch organization results
        """
        results = {
            "total_products": len(products),
            "total_images_processed": 0,
            "total_images_renamed": 0,
            "product_results": []
        }
        
        for product in products:
            product_result = self.organize_by_product(product)
            results["product_results"].append(product_result)
            results["total_images_processed"] += product_result["images_processed"]
            results["total_images_renamed"] += product_result["images_renamed"]
        
        logger.info(f"Batch organized {results['total_images_processed']} images")
        return results
    
    def validate_image_structure(self, image_path: Path) -> Dict[str, Any]:
        """
        Validate image file structure and quality
        
        Args:
            image_path: Path to image file
            
        Returns:
            Validation results
        """
        results = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "metadata": None
        }
        
        try:
            # Check if file exists
            if not image_path.exists():
                results["valid"] = False
                results["errors"].append("File does not exist")
                return results
            
            # Check file size
            file_size = image_path.stat().st_size
            if file_size < 1024:  # Less than 1KB
                results["warnings"].append("File size is very small")
            elif file_size > 10 * 1024 * 1024:  # More than 10MB
                results["warnings"].append("File size is very large")
            
            # Get metadata
            metadata = self.manager.get_image_metadata(image_path)
            if metadata:
                results["metadata"] = metadata
                
                # Check dimensions
                if metadata["width"] < 300 or metadata["height"] < 300:
                    results["warnings"].append("Image dimensions are very small")
                
                # Check format
                if metadata["format"] not in ["JPEG", "PNG", "WEBP"]:
                    results["warnings"].append(f"Image format {metadata['format']} may not be optimal")
            else:
                results["valid"] = False
                results["errors"].append("Could not read image metadata")
            
        except Exception as e:
            results["valid"] = False
            results["errors"].append(f"Validation failed: {str(e)}")
        
        return results

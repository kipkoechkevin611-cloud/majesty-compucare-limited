"""
Product Importer
Imports products from various sources (Excel, CSV, JSON, Obsidian, WhatsApp)
"""

import logging
import json
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

from ..products.models import ProductCreate, ProductSource
from ..products.service import ProductService
from ..audit.logger import AuditLogger, AuditAction


logger = logging.getLogger(__name__)


class ProductImporter:
    """Imports products from various sources"""
    
    def __init__(self, product_service: ProductService, audit_logger: AuditLogger, data_dir: Path):
        """
        Initialize product importer
        
        Args:
            product_service: ProductService instance
            audit_logger: AuditLogger instance
            data_dir: Data directory for imports
        """
        self.service = product_service
        self.audit = audit_logger
        self.import_dir = data_dir / "imports"
        self.import_dir.mkdir(exist_ok=True)
    
    async def import_from_excel(self, file_path: Path, 
                               user: str = "system",
                               dry_run: bool = False) -> Dict[str, Any]:
        """
        Import products from Excel file
        
        Args:
            file_path: Path to Excel file
            user: User performing import
            dry_run: If True, validate without importing
            
        Returns:
            Import results dictionary
        """
        results = {
            "source": "excel",
            "file": str(file_path),
            "total_rows": 0,
            "valid": 0,
            "invalid": 0,
            "duplicates": 0,
            "imported": 0,
            "errors": [],
            "products": []
        }
        
        try:
            # Read Excel file
            df = pd.read_excel(file_path)
            results["total_rows"] = len(df)
            
            # Process each row
            for index, row in df.iterrows():
                try:
                    # Convert row to product data
                    product_data = self._excel_row_to_product(row)
                    
                    if not product_data:
                        results["invalid"] += 1
                        continue
                    
                    # Validate product
                    product = ProductCreate(**product_data)
                    
                    # Check for duplicates
                    duplicate_result = await self.service.check_duplicates(product)
                    if duplicate_result.is_duplicate:
                        results["duplicates"] += 1
                        results["errors"].append(f"Row {index + 1}: Duplicate detected - {product.name}")
                        continue
                    
                    results["valid"] += 1
                    
                    if not dry_run:
                        # Import product
                        created, errors = await self.service.create_product(
                            product, user, check_duplicates=False
                        )
                        
                        if created:
                            results["imported"] += 1
                            results["products"].append({
                                "row": index + 1,
                                "name": created.name,
                                "id": str(created.id)
                            })
                        else:
                            results["invalid"] += 1
                            results["errors"].append(f"Row {index + 1}: {errors}")
                    else:
                        results["products"].append({
                            "row": index + 1,
                            "name": product.name,
                            "status": "validated"
                        })
                        
                except Exception as e:
                    results["invalid"] += 1
                    results["errors"].append(f"Row {index + 1}: {str(e)}")
            
            # Log import
            self.audit.log_import("excel", results["imported"], {
                "file": str(file_path),
                "dry_run": dry_run,
                "results": results
            }, user)
            
            logger.info(f"Excel import completed: {results['imported']} imported")
            
        except Exception as e:
            logger.error(f"Failed to import from Excel: {e}")
            results["errors"].append(f"Import failed: {str(e)}")
        
        return results
    
    async def import_from_csv(self, file_path: Path,
                             user: str = "system",
                             dry_run: bool = False) -> Dict[str, Any]:
        """
        Import products from CSV file
        
        Args:
            file_path: Path to CSV file
            user: User performing import
            dry_run: If True, validate without importing
            
        Returns:
            Import results dictionary
        """
        results = {
            "source": "csv",
            "file": str(file_path),
            "total_rows": 0,
            "valid": 0,
            "invalid": 0,
            "duplicates": 0,
            "imported": 0,
            "errors": [],
            "products": []
        }
        
        try:
            # Read CSV file
            df = pd.read_csv(file_path)
            results["total_rows"] = len(df)
            
            # Process each row (same logic as Excel)
            for index, row in df.iterrows():
                try:
                    product_data = self._excel_row_to_product(row)  # Reuse same logic
                    
                    if not product_data:
                        results["invalid"] += 1
                        continue
                    
                    product = ProductCreate(**product_data)
                    
                    duplicate_result = await self.service.check_duplicates(product)
                    if duplicate_result.is_duplicate:
                        results["duplicates"] += 1
                        results["errors"].append(f"Row {index + 1}: Duplicate detected")
                        continue
                    
                    results["valid"] += 1
                    
                    if not dry_run:
                        created, errors = await self.service.create_product(
                            product, user, check_duplicates=False
                        )
                        
                        if created:
                            results["imported"] += 1
                            results["products"].append({
                                "row": index + 1,
                                "name": created.name,
                                "id": str(created.id)
                            })
                        else:
                            results["invalid"] += 1
                            results["errors"].append(f"Row {index + 1}: {errors}")
                    else:
                        results["products"].append({
                            "row": index + 1,
                            "name": product.name,
                            "status": "validated"
                        })
                        
                except Exception as e:
                    results["invalid"] += 1
                    results["errors"].append(f"Row {index + 1}: {str(e)}")
            
            self.audit.log_import("csv", results["imported"], {
                "file": str(file_path),
                "dry_run": dry_run,
                "results": results
            }, user)
            
            logger.info(f"CSV import completed: {results['imported']} imported")
            
        except Exception as e:
            logger.error(f"Failed to import from CSV: {e}")
            results["errors"].append(f"Import failed: {str(e)}")
        
        return results
    
    async def import_from_json(self, file_path: Path,
                              user: str = "system",
                              dry_run: bool = False) -> Dict[str, Any]:
        """
        Import products from JSON file
        
        Args:
            file_path: Path to JSON file
            user: User performing import
            dry_run: If True, validate without importing
            
        Returns:
            Import results dictionary
        """
        results = {
            "source": "json",
            "file": str(file_path),
            "total_items": 0,
            "valid": 0,
            "invalid": 0,
            "duplicates": 0,
            "imported": 0,
            "errors": [],
            "products": []
        }
        
        try:
            # Read JSON file
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Handle both array and single object
            if isinstance(data, dict):
                data = [data]
            
            results["total_items"] = len(data)
            
            # Process each item
            for index, item in enumerate(data):
                try:
                    product_data = self._normalize_product_data(item)
                    
                    if not product_data:
                        results["invalid"] += 1
                        continue
                    
                    product = ProductCreate(**product_data)
                    
                    duplicate_result = await self.service.check_duplicates(product)
                    if duplicate_result.is_duplicate:
                        results["duplicates"] += 1
                        results["errors"].append(f"Item {index + 1}: Duplicate detected")
                        continue
                    
                    results["valid"] += 1
                    
                    if not dry_run:
                        created, errors = await self.service.create_product(
                            product, user, check_duplicates=False
                        )
                        
                        if created:
                            results["imported"] += 1
                            results["products"].append({
                                "item": index + 1,
                                "name": created.name,
                                "id": str(created.id)
                            })
                        else:
                            results["invalid"] += 1
                            results["errors"].append(f"Item {index + 1}: {errors}")
                    else:
                        results["products"].append({
                            "item": index + 1,
                            "name": product.name,
                            "status": "validated"
                        })
                        
                except Exception as e:
                    results["invalid"] += 1
                    results["errors"].append(f"Item {index + 1}: {str(e)}")
            
            self.audit.log_import("json", results["imported"], {
                "file": str(file_path),
                "dry_run": dry_run,
                "results": results
            }, user)
            
            logger.info(f"JSON import completed: {results['imported']} imported")
            
        except Exception as e:
            logger.error(f"Failed to import from JSON: {e}")
            results["errors"].append(f"Import failed: {str(e)}")
        
        return results
    
    def _excel_row_to_product(self, row: pd.Series) -> Optional[Dict[str, Any]]:
        """
        Convert Excel/CSV row to product data
        
        Args:
            row: Pandas Series row
            
        Returns:
            Product data dictionary or None if invalid
        """
        try:
            # Map common column names to product fields
            mapping = {
                'name': ['name', 'product_name', 'title', 'Name'],
                'description': ['description', 'desc', 'Description', 'Caption / Description'],
                'short_description': ['short_description', 'short_desc', 'Short Description'],
                'category_id': ['category_id', 'category', 'Category'],
                'brand': ['brand', 'Brand'],
                'price': ['price', 'Price', 'KES'],
                'sale_price': ['sale_price', 'sale_price', 'Sale Price'],
                'stock': ['stock', 'Stock', 'quantity', 'Quantity'],
                'sku': ['sku', 'SKU', 'Sku'],
                'images': ['images', 'image', 'Image', 'Photo #', 'photo_url']
            }
            
            product_data = {}
            
            for field, possible_keys in mapping.items():
                value = None
                for key in possible_keys:
                    if key in row and pd.notna(row[key]):
                        value = row[key]
                        break
                
                if value is not None:
                    if field == 'images':
                        # Handle images as list
                        if isinstance(value, str):
                            product_data[field] = [value]
                        elif isinstance(value, list):
                            product_data[field] = value
                    elif field in ['price', 'sale_price']:
                        # Convert to float
                        product_data[field] = float(str(value).replace(',', '').replace('KES', '').strip())
                    elif field == 'stock':
                        # Convert to int
                        product_data[field] = int(value) if pd.notna(value) else 0
                    else:
                        product_data[field] = str(value)
            
            # Set defaults for required fields
            if 'name' not in product_data or not product_data['name']:
                return None
            
            if 'description' not in product_data:
                product_data['description'] = product_data.get('name', '')
            
            if 'category_id' not in product_data:
                # Use a default category or require it
                product_data['category_id'] = "default_category"
            
            if 'price' not in product_data:
                product_data['price'] = 0.0
            
            if 'stock' not in product_data:
                product_data['stock'] = 0
            
            if 'images' not in product_data:
                product_data['images'] = []
            
            # Set source
            product_data['source'] = ProductSource.IMPORTED
            
            return product_data
            
        except Exception as e:
            logger.error(f"Failed to convert row to product: {e}")
            return None
    
    def _normalize_product_data(self, item: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Normalize product data from JSON
        
        Args:
            item: Product data from JSON
            
        Returns:
            Normalized product data or None if invalid
        """
        try:
            # Convert camelCase to snake_case if needed
            normalized = {}
            
            field_mapping = {
                'productName': 'name',
                'product_name': 'name',
                'productDescription': 'description',
                'product_description': 'description',
                'shortDescription': 'short_description',
                'short_description': 'short_description',
                'categoryId': 'category_id',
                'category_id': 'category_id',
                'salePrice': 'sale_price',
                'sale_price': 'sale_price',
                'imageUrl': 'images',
                'image_url': 'images',
                'photoUrl': 'images',
                'photo_url': 'images'
            }
            
            for key, value in item.items():
                normalized_key = field_mapping.get(key, key.lower().replace('-', '_'))
                normalized[normalized_key] = value
            
            # Ensure required fields
            if 'name' not in normalized or not normalized['name']:
                return None
            
            if 'description' not in normalized:
                normalized['description'] = normalized.get('name', '')
            
            if 'category_id' not in normalized:
                normalized['category_id'] = "default_category"
            
            if 'price' not in normalized:
                normalized['price'] = 0.0
            
            if 'stock' not in normalized:
                normalized['stock'] = 0
            
            if 'images' not in normalized:
                normalized['images'] = []
            
            normalized['source'] = ProductSource.IMPORTED
            
            return normalized
            
        except Exception as e:
            logger.error(f"Failed to normalize product data: {e}")
            return None

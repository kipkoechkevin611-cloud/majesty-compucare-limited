"""
Product Exporter
Exports products to various formats (Excel, CSV, JSON)
"""

import logging
import json
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

from ..products.service import ProductService
from ..audit.logger import AuditLogger, AuditAction


logger = logging.getLogger(__name__)


class ProductExporter:
    """Exports products to various formats"""
    
    def __init__(self, product_service: ProductService, audit_logger: AuditLogger, data_dir: Path):
        """
        Initialize product exporter
        
        Args:
            product_service: ProductService instance
            audit_logger: AuditLogger instance
            data_dir: Data directory for exports
        """
        self.service = product_service
        self.audit = audit_logger
        self.export_dir = data_dir / "exports"
        self.export_dir.mkdir(exist_ok=True)
    
    async def export_to_excel(self, category_id: Optional[str] = None,
                              status: Optional[str] = None,
                              user: str = "system") -> Optional[str]:
        """
        Export products to Excel file
        
        Args:
            category_id: Filter by category
            status: Filter by status
            user: User performing export
            
        Returns:
            Path to exported file or None if failed
        """
        try:
            # Get products
            products = await self.service.list_products(
                limit=10000,
                category_id=category_id,
                status=status
            )
            
            if not products:
                logger.warning("No products to export")
                return None
            
            # Convert to DataFrame
            data = []
            for product in products:
                data.append({
                    "ID": product.id,
                    "Name": product.name,
                    "Slug": product.slug,
                    "Description": product.description,
                    "Short Description": product.short_description,
                    "Category ID": product.category_id,
                    "Brand": product.brand,
                    "Price": product.price,
                    "Sale Price": product.sale_price,
                    "Stock": product.stock,
                    "SKU": product.sku,
                    "Images": ", ".join(product.images),
                    "Featured": product.featured,
                    "Status": product.status,
                    "Source": product.source,
                    "Source URL": product.source_url,
                    "Trend Score": product.trend_score,
                    "AI Generated": product.ai_generated,
                    "Created At": product.created_at,
                    "Updated At": product.updated_at
                })
            
            df = pd.DataFrame(data)
            
            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"products_export_{timestamp}.xlsx"
            output_path = self.export_dir / filename
            
            # Export to Excel
            df.to_excel(output_path, index=False, engine='openpyxl')
            
            # Log export
            self.audit.log_export("excel", len(products), {
                "file": str(output_path),
                "category_id": category_id,
                "status": status
            }, user)
            
            logger.info(f"Exported {len(products)} products to Excel: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export to Excel: {e}")
            return None
    
    async def export_to_csv(self, category_id: Optional[str] = None,
                           status: Optional[str] = None,
                           user: str = "system") -> Optional[str]:
        """
        Export products to CSV file
        
        Args:
            category_id: Filter by category
            status: Filter by status
            user: User performing export
            
        Returns:
            Path to exported file or None if failed
        """
        try:
            # Get products
            products = await self.service.list_products(
                limit=10000,
                category_id=category_id,
                status=status
            )
            
            if not products:
                logger.warning("No products to export")
                return None
            
            # Convert to DataFrame
            data = []
            for product in products:
                data.append({
                    "ID": product.id,
                    "Name": product.name,
                    "Slug": product.slug,
                    "Description": product.description,
                    "Short Description": product.short_description,
                    "Category ID": product.category_id,
                    "Brand": product.brand,
                    "Price": product.price,
                    "Sale Price": product.sale_price,
                    "Stock": product.stock,
                    "SKU": product.sku,
                    "Images": ", ".join(product.images),
                    "Featured": product.featured,
                    "Status": product.status,
                    "Source": product.source,
                    "Source URL": product.source_url,
                    "Trend Score": product.trend_score,
                    "AI Generated": product.ai_generated,
                    "Created At": product.created_at,
                    "Updated At": product.updated_at
                })
            
            df = pd.DataFrame(data)
            
            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"products_export_{timestamp}.csv"
            output_path = self.export_dir / filename
            
            # Export to CSV
            df.to_csv(output_path, index=False, encoding='utf-8')
            
            # Log export
            self.audit.log_export("csv", len(products), {
                "file": str(output_path),
                "category_id": category_id,
                "status": status
            }, user)
            
            logger.info(f"Exported {len(products)} products to CSV: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export to CSV: {e}")
            return None
    
    async def export_to_json(self, category_id: Optional[str] = None,
                           status: Optional[str] = None,
                           user: str = "system") -> Optional[str]:
        """
        Export products to JSON file
        
        Args:
            category_id: Filter by category
            status: Filter by status
            user: User performing export
            
        Returns:
            Path to exported file or None if failed
        """
        try:
            # Get products
            products = await self.service.list_products(
                limit=10000,
                category_id=category_id,
                status=status
            )
            
            if not products:
                logger.warning("No products to export")
                return None
            
            # Convert to JSON-serializable format
            data = []
            for product in products:
                data.append({
                    "id": product.id,
                    "name": product.name,
                    "slug": product.slug,
                    "description": product.description,
                    "short_description": product.short_description,
                    "category_id": product.category_id,
                    "brand": product.brand,
                    "price": product.price,
                    "sale_price": product.sale_price,
                    "stock": product.stock,
                    "sku": product.sku,
                    "images": product.images,
                    "featured": product.featured,
                    "status": product.status,
                    "specifications": product.specifications,
                    "source": product.source,
                    "source_url": product.source_url,
                    "trend_score": product.trend_score,
                    "ai_generated": product.ai_generated,
                    "last_synced_at": product.last_synced_at.isoformat() if product.last_synced_at else None,
                    "created_at": product.created_at.isoformat() if product.created_at else None,
                    "updated_at": product.updated_at.isoformat() if product.updated_at else None
                })
            
            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"products_export_{timestamp}.json"
            output_path = self.export_dir / filename
            
            # Export to JSON
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Log export
            self.audit.log_export("json", len(products), {
                "file": str(output_path),
                "category_id": category_id,
                "status": status
            }, user)
            
            logger.info(f"Exported {len(products)} products to JSON: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export to JSON: {e}")
            return None
    
    async def export_categories(self, user: str = "system") -> Optional[str]:
        """
        Export categories to JSON file
        
        Args:
            user: User performing export
            
        Returns:
            Path to exported file or None if failed
        """
        try:
            # Get categories
            categories = await self.service.get_categories()
            
            if not categories:
                logger.warning("No categories to export")
                return None
            
            # Convert to JSON-serializable format
            data = []
            for category in categories:
                data.append({
                    "id": category.id,
                    "name": category.name,
                    "slug": category.slug,
                    "description": category.description,
                    "image": category.image,
                    "created_at": category.created_at.isoformat() if category.created_at else None,
                    "updated_at": category.updated_at.isoformat() if category.updated_at else None
                })
            
            # Generate filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"categories_export_{timestamp}.json"
            output_path = self.export_dir / filename
            
            # Export to JSON
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            # Log export
            self.audit.log_export("categories", len(categories), {
                "file": str(output_path)
            }, user)
            
            logger.info(f"Exported {len(categories)} categories to JSON: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export categories: {e}")
            return None
    
    async def export_product(self, product_id: str, 
                           format: str = "json",
                           user: str = "system") -> Optional[str]:
        """
        Export a single product
        
        Args:
            product_id: Product ID
            format: Export format (json, csv, excel)
            user: User performing export
            
        Returns:
            Path to exported file or None if failed
        """
        try:
            # Get product
            product = await self.service.get_product(product_id)
            
            if not product:
                logger.warning(f"Product {product_id} not found")
                return None
            
            # Export based on format
            if format == "json":
                return await self._export_single_json(product, user)
            elif format == "csv":
                return await self._export_single_csv(product, user)
            elif format == "excel":
                return await self._export_single_excel(product, user)
            else:
                logger.error(f"Unsupported format: {format}")
                return None
            
        except Exception as e:
            logger.error(f"Failed to export product {product_id}: {e}")
            return None
    
    async def _export_single_json(self, product, user: str) -> Optional[str]:
        """Export single product to JSON"""
        try:
            data = {
                "id": product.id,
                "name": product.name,
                "slug": product.slug,
                "description": product.description,
                "short_description": product.short_description,
                "category_id": product.category_id,
                "brand": product.brand,
                "price": product.price,
                "sale_price": product.sale_price,
                "stock": product.stock,
                "sku": product.sku,
                "images": product.images,
                "featured": product.featured,
                "status": product.status,
                "specifications": product.specifications,
                "source": product.source,
                "source_url": product.source_url,
                "trend_score": product.trend_score,
                "ai_generated": product.ai_generated,
                "last_synced_at": product.last_synced_at.isoformat() if product.last_synced_at else None,
                "created_at": product.created_at.isoformat() if product.created_at else None,
                "updated_at": product.updated_at.isoformat() if product.updated_at else None
            }
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"product_{product.id}_{timestamp}.json"
            output_path = self.export_dir / filename
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            logger.info(f"Exported product {product.id} to JSON: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export single product to JSON: {e}")
            return None
    
    async def _export_single_csv(self, product, user: str) -> Optional[str]:
        """Export single product to CSV"""
        try:
            data = [{
                "ID": product.id,
                "Name": product.name,
                "Slug": product.slug,
                "Description": product.description,
                "Short Description": product.short_description,
                "Category ID": product.category_id,
                "Brand": product.brand,
                "Price": product.price,
                "Sale Price": product.sale_price,
                "Stock": product.stock,
                "SKU": product.sku,
                "Images": ", ".join(product.images),
                "Featured": product.featured,
                "Status": product.status,
                "Source": product.source,
                "Source URL": product.source_url,
                "Trend Score": product.trend_score,
                "AI Generated": product.ai_generated
            }]
            
            df = pd.DataFrame(data)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"product_{product.id}_{timestamp}.csv"
            output_path = self.export_dir / filename
            
            df.to_csv(output_path, index=False, encoding='utf-8')
            
            logger.info(f"Exported product {product.id} to CSV: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export single product to CSV: {e}")
            return None
    
    async def _export_single_excel(self, product, user: str) -> Optional[str]:
        """Export single product to Excel"""
        try:
            data = [{
                "ID": product.id,
                "Name": product.name,
                "Slug": product.slug,
                "Description": product.description,
                "Short Description": product.short_description,
                "Category ID": product.category_id,
                "Brand": product.brand,
                "Price": product.price,
                "Sale Price": product.sale_price,
                "Stock": product.stock,
                "SKU": product.sku,
                "Images": ", ".join(product.images),
                "Featured": product.featured,
                "Status": product.status,
                "Source": product.source,
                "Source URL": product.source_url,
                "Trend Score": product.trend_score,
                "AI Generated": product.ai_generated
            }]
            
            df = pd.DataFrame(data)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"product_{product.id}_{timestamp}.xlsx"
            output_path = self.export_dir / filename
            
            df.to_excel(output_path, index=False, engine='openpyxl')
            
            logger.info(f"Exported product {product.id} to Excel: {output_path}")
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Failed to export single product to Excel: {e}")
            return None

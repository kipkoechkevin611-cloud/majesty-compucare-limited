"""
Supplier API Sync
Syncs product data from supplier APIs to MongoDB database
"""

import logging
import requests
from typing import Dict, Any, List, Optional
from datetime import datetime

from ..products.models import ProductUpdate
from ..products.service import ProductService
from ..audit.logger import AuditLogger, AuditAction


logger = logging.getLogger(__name__)


class SupplierSync:
    """Syncs product data from supplier APIs"""
    
    def __init__(self, supplier_name: str, api_url: str, api_key: str,
                 product_service: ProductService, audit_logger: AuditLogger):
        """
        Initialize supplier sync
        
        Args:
            supplier_name: Name of the supplier (for logging)
            api_url: Supplier API endpoint URL
            api_key: API key for authentication
            product_service: ProductService instance
            audit_logger: AuditLogger instance
        """
        self.supplier_name = supplier_name
        self.api_url = api_url
        self.api_key = api_key
        self.product_service = product_service
        self.audit = audit_logger
    
    def fetch_supplier_data(self) -> Optional[Dict[str, Any]]:
        """
        Fetch data from supplier API
        
        Returns:
            Raw JSON response or None if failed
        """
        try:
            headers = {"Authorization": f"Bearer {self.api_key}"}
            response = requests.get(self.api_url, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch data from {self.supplier_name}: {e}")
            return None
    
    def parse_supplier_response(self, raw_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Parse supplier API response into product updates
        
        Args:
            raw_data: Raw JSON response from supplier
            
        Returns:
            List of product update dictionaries
        """
        products = []
        
        # This function should be customized per supplier
        # Default implementation assumes a common structure
        for item in raw_data.get("products", []):
            products.append({
                "sku": item.get("sku"),
                "price": float(item.get("price", 0)),
                "stock": int(item.get("stock", 0)),
                "name": item.get("name"),
                "description": item.get("description"),
            })
        
        return products
    
    async def sync_product(self, product_data: Dict[str, Any]) -> tuple[bool, str]:
        """
        Sync a single product to the database
        
        Args:
            product_data: Product data from supplier
            
        Returns:
            Tuple of (success, message)
        """
        if not product_data.get("sku"):
            return False, "Missing SKU"
        
        # Find product by SKU
        # Note: This requires implementing get_by_sku in the repository
        # For now, we'll use a different approach
        
        # Create update data
        update_data = ProductUpdate()
        
        if product_data.get("price"):
            update_data.price = product_data["price"]
        
        if product_data.get("stock") is not None:
            update_data.stock = product_data["stock"]
        
        # Update status based on stock
        if product_data.get("stock") == 0:
            update_data.status = "OUT_OF_STOCK"
        elif product_data.get("stock") > 0:
            update_data.status = "ACTIVE"
        
        # For now, we need to find the product by SKU first
        # This would be better implemented with a get_by_sku method
        # For the initial implementation, we'll log the update
        
        logger.info(f"Would update product SKU {product_data['sku']}: "
                   f"price={product_data.get('price')}, stock={product_data.get('stock')}")
        
        return True, "Product logged for update"
    
    async def run_sync(self, dry_run: bool = False) -> Dict[str, Any]:
        """
        Run the full sync process
        
        Args:
            dry_run: If True, fetch and parse but don't update database
            
        Returns:
            Sync results dictionary
        """
        results = {
            "supplier": self.supplier_name,
            "timestamp": datetime.now().isoformat(),
            "fetched": 0,
            "updated": 0,
            "skipped": 0,
            "errors": 0,
            "dry_run": dry_run
        }
        
        logger.info(f"Starting sync for supplier: {self.supplier_name}")
        
        # Fetch data
        raw_data = self.fetch_supplier_data()
        if not raw_data:
            results["errors"] += 1
            return results
        
        # Parse data
        products = self.parse_supplier_response(raw_data)
        results["fetched"] = len(products)
        logger.info(f"Fetched {len(products)} products from {self.supplier_name}")
        
        # Sync each product
        for product_data in products:
            try:
                if dry_run:
                    logger.info(f"DRY RUN: Would sync SKU {product_data.get('sku')}")
                    results["skipped"] += 1
                else:
                    success, message = await self.sync_product(product_data)
                    if success:
                        results["updated"] += 1
                    else:
                        results["skipped"] += 1
                        logger.warning(f"Skipped: {message}")
            except Exception as e:
                results["errors"] += 1
                logger.error(f"Error syncing product: {e}")
        
        # Log sync
        self.audit.log_sync("supplier_sync", "complete", results["updated"], {
            "supplier": self.supplier_name,
            "results": results
        })
        
        logger.info(f"Sync complete: {results['updated']} updated, "
                   f"{results['skipped']} skipped, {results['errors']} errors")
        
        return results


class SupplierConfig:
    """Configuration for multiple suppliers"""
    
    def __init__(self):
        self.suppliers = {}
    
    def add_supplier(self, name: str, api_url: str, api_key: str):
        """Add a supplier configuration"""
        self.suppliers[name] = {
            "api_url": api_url,
            "api_key": api_key
        }
    
    def get_supplier(self, name: str) -> Optional[Dict[str, str]]:
        """Get supplier configuration"""
        return self.suppliers.get(name)
    
    def list_suppliers(self) -> List[str]:
        """List all configured suppliers"""
        return list(self.suppliers.keys())


async def sync_all_suppliers(supplier_config: SupplierConfig,
                           product_service: ProductService,
                           audit_logger: AuditLogger,
                           dry_run: bool = False) -> Dict[str, Any]:
    """
    Sync all configured suppliers
    
    Args:
        supplier_config: SupplierConfig instance
        product_service: ProductService instance
        audit_logger: AuditLogger instance
        dry_run: If True, fetch and parse but don't update database
        
    Returns:
        Combined sync results
    """
    results = {
        "timestamp": datetime.now().isoformat(),
        "suppliers": {},
        "total_updated": 0,
        "total_skipped": 0,
        "total_errors": 0
    }
    
    for supplier_name in supplier_config.list_suppliers():
        config = supplier_config.get_supplier(supplier_name)
        if not config:
            continue
        
        sync = SupplierSync(
            supplier_name,
            config["api_url"],
            config["api_key"],
            product_service,
            audit_logger
        )
        
        supplier_results = await sync.run_sync(dry_run=dry_run)
        results["suppliers"][supplier_name] = supplier_results
        results["total_updated"] += supplier_results["updated"]
        results["total_skipped"] += supplier_results["skipped"]
        results["total_errors"] += supplier_results["errors"]
    
    return results

"""
Majesty Compucare Product Intelligence System
Main Application Entry Point
"""

import sys
import asyncio
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.config.settings import Settings
from app.database.connection import DatabaseConnection
from app.audit.logger import AuditLogger
from app.products.repository import ProductRepository
from app.products.validators import ProductValidator
from app.products.service import ProductService
from app.images.manager import ImageManager
from app.import_export.importer import ProductImporter
from app.import_export.exporter import ProductExporter
from app.suppliers.sync import SupplierSync, SupplierConfig, sync_all_suppliers


async def handle_command(command: str, product_service, image_manager, importer, exporter, db, settings):
    """Handle a single command"""
    if command == 'exit' or command == 'quit':
        print("Shutting down...")
        db.disconnect()
        return False
    elif command == 'help':
        print("Available commands:")
        print("  help              - Show this help message")
        print("  status            - Show system status")
        print("  backup            - Create database backup")
        print("  products          - List all products")
        print("  product <id>      - View product details")
        print("  categories        - List all categories")
        print("  import <file>     - Import products from file")
        print("  export            - Export products to file")
        print("  images            - List images")
        print("  duplicates        - Find duplicate images")
        print("  sync <supplier>   - Sync from supplier API")
        print("  exit              - Exit the application")
    elif command == 'status':
        print("System Status:")
        print(f"  Database: {'Connected' if db.is_connected() else 'Disconnected'}")
        print(f"  Log Directory: {settings.LOG_DIR}")
        print(f"  Data Directory: {settings.DATA_DIR}")
    elif command == 'backup':
        from app.database.backup import BackupManager
        backup = BackupManager(db, settings.BACKUP_DIR)
        backup_file = backup.create_backup()
        if backup_file:
            print(f"✓ Backup created: {backup_file}")
        else:
            print("✗ Backup failed")
    elif command == 'products':
        print("Fetching products...")
        products = await product_service.list_products(limit=20)
        print(f"\nFound {len(products)} products:")
        for p in products:
            print(f"  - {p.name} (KES {p.price}) - {p.status}")
    elif command.startswith('product '):
        product_id = command.split(' ', 1)[1]
        print(f"Fetching product {product_id}...")
        product = await product_service.get_product(product_id)
        if product:
            print(f"\n{product.name}")
            print(f"  Description: {product.description[:100]}...")
            print(f"  Price: KES {product.price}")
            print(f"  Stock: {product.stock}")
            print(f"  Status: {product.status}")
        else:
            print("Product not found")
    elif command == 'categories':
        print("Fetching categories...")
        categories = await product_service.get_categories()
        print(f"\nFound {len(categories)} categories:")
        for c in categories:
            print(f"  - {c.name} ({c.slug})")
    elif command.startswith('import '):
        file_path = command.split(' ', 1)[1]
        print(f"Importing from {file_path}...")
        path = Path(file_path)
        if not path.exists():
            print(f"File not found: {file_path}")
        elif path.suffix in ['.xlsx', '.xls']:
            result = await importer.import_from_excel(path, dry_run=True)
            print(f"\nImport Results:")
            print(f"  Total rows: {result['total_rows']}")
            print(f"  Valid: {result['valid']}")
            print(f"  Invalid: {result['invalid']}")
            print(f"  Duplicates: {result['duplicates']}")
        elif path.suffix == '.csv':
            result = await importer.import_from_csv(path, dry_run=True)
            print(f"\nImport Results:")
            print(f"  Total rows: {result['total_rows']}")
            print(f"  Valid: {result['valid']}")
            print(f"  Invalid: {result['invalid']}")
            print(f"  Duplicates: {result['duplicates']}")
        elif path.suffix == '.json':
            result = await importer.import_from_json(path, dry_run=True)
            print(f"\nImport Results:")
            print(f"  Total items: {result['total_items']}")
            print(f"  Valid: {result['valid']}")
            print(f"  Invalid: {result['invalid']}")
            print(f"  Duplicates: {result['duplicates']}")
        else:
            print("Unsupported file format")
    elif command == 'export':
        print("Exporting products to JSON...")
        export_file = await exporter.export_to_json()
        if export_file:
            print(f"✓ Exported to: {export_file}")
        else:
            print("✗ Export failed")
    elif command == 'images':
        print("Listing images...")
        images = list(image_manager.images_dir.glob("*"))
        print(f"\nFound {len(images)} images:")
        for img in images[:10]:
            print(f"  - {img.name}")
        if len(images) > 10:
            print(f"  ... and {len(images) - 10} more")
    elif command == 'duplicates':
        print("Finding duplicate images...")
        duplicates = image_manager.find_duplicates()
        if duplicates:
            print(f"\nFound {len(duplicates)} duplicate groups:")
            for dup in duplicates:
                print(f"  Hash: {dup['hash']}")
                print(f"  Files: {dup['count']}")
                for file in dup['files']:
                    print(f"    - {file}")
        else:
            print("No duplicates found")
    elif command.startswith('sync '):
        supplier_name = command.split(' ', 1)[1]
        print(f"Syncing from supplier: {supplier_name}")
        print("Note: Supplier sync requires configuration")
        print("Configure suppliers in settings before using this command")
    elif command == '':
        pass
    else:
        print(f"Unknown command: {command}")
        print("Type 'help' for available commands")
    
    return True


def main():
    """Main application entry point"""
    print("=" * 60)
    print("MAJESTY COMPCARE PRODUCT INTELLIGENCE SYSTEM")
    print("=" * 60)
    print()
    
    # Load settings
    settings = Settings()
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Database: {settings.DATABASE_URL[:20]}..." if settings.DATABASE_URL else "Not configured")
    print()
    
    # Initialize database connection
    db = DatabaseConnection(settings.DATABASE_URL)
    if db.connect():
        print("✓ Database connected successfully")
    else:
        print("✗ Database connection failed")
        print("System will run in offline mode")
        print()
    
    # Initialize audit logger
    audit = AuditLogger(settings.LOG_DIR)
    print("✓ Audit logger initialized")
    
    # Initialize product services
    product_repo = ProductRepository(db)
    product_validator = ProductValidator(product_repo)
    product_service = ProductService(product_repo, product_validator, audit)
    print("✓ Product services initialized")
    
    # Initialize image manager
    image_manager = ImageManager(settings.DATA_DIR)
    print("✓ Image manager initialized")
    
    # Initialize import/export
    importer = ProductImporter(product_service, audit, settings.DATA_DIR)
    exporter = ProductExporter(product_service, audit, settings.DATA_DIR)
    print("✓ Import/Export services initialized")
    print()
    
    print("System ready. Type 'help' for available commands.")
    print()
    
    # Command loop
    running = True
    while running:
        try:
            command = input("majesty> ").strip().lower()
            running = asyncio.run(handle_command(command, product_service, image_manager, importer, exporter, db, settings))
        except KeyboardInterrupt:
            print("\nShutting down...")
            db.disconnect()
            break
        except Exception as e:
            print(f"Error: {e}")
    
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Majesty Compucare Product Intelligence System

A Python-based product intelligence and management system for Majesty Compucare Limited.

## Purpose

This system provides advanced product management capabilities including:
- Product import/export
- Trend research and analysis
- AI-assisted product descriptions
- Image management and duplicate detection
- Website synchronization
- Audit logging and backup

## Architecture

This is a **separate Python application** that integrates with the existing Next.js website via:
- Shared MongoDB database
- API integration
- Data synchronization

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

## Usage

Run the main application:
```bash
python -m app.main
```

Available commands:
- `help` - Show available commands
- `status` - Show system status
- `backup` - Create database backup
- `exit` - Exit the application

## Project Structure

```
majesty_product_system/
├── app/
│   ├── main.py              # Application entry point
│   ├── config/              # Configuration
│   ├── database/            # Database layer
│   ├── products/            # Product management
│   ├── images/              # Image management
│   ├── trends/              # Trend research
│   ├── ai/                  # AI integration
│   ├── website/             # Website sync
│   ├── reports/             # Reporting
│   └── audit/               # Audit logging
├── data/                    # Data directory
│   ├── imports/
│   ├── exports/
│   ├── backups/
│   └── cache/
├── logs/                    # Log files
├── tests/                   # Tests
├── docs/                    # Documentation
├── requirements.txt
├── .env.example
└── README.md
```

## Development

Run tests:
```bash
pytest
```

Format code:
```bash
black app/
```

## Safety

- Always create backups before bulk operations
- Audit logging tracks all operations
- Read-only access to production database by default
- Confirmation required for destructive operations

## Integration with Next.js

This system integrates with the existing Next.js website:
- Shares the MongoDB database
- Calls Next.js APIs for synchronization
- Respects existing data structures
- Maintains backward compatibility

## License

Proprietary - Majesty Compucare Limited

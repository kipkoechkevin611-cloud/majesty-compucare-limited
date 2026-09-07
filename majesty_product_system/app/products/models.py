"""
Product Data Models
Pydantic models for product data validation and serialization
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ProductStatus(str, Enum):
    """Product status enum"""
    ACTIVE = "ACTIVE"
    DRAFT = "DRAFT"
    OUT_OF_STOCK = "OUT_OF_STOCK"


class ProductSource(str, Enum):
    """Product source enum"""
    MANUAL = "MANUAL"
    WEBSITE = "WEBSITE"
    WHATSAPP = "WHATSAPP"
    OBSIDIAN = "OBSIDIAN"
    SUPPLIER = "SUPPLIER"
    OFFICIAL_MANUFACTURER = "OFFICIAL_MANUFACTURER"
    WEB_RESEARCH = "WEB_RESEARCH"
    AI_GENERATED = "AI_GENERATED"
    IMPORTED = "IMPORTED"


class ProductModel(BaseModel):
    """Product model for database operations"""
    
    id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=500)
    slug: Optional[str] = None
    description: str = Field(..., min_length=1)
    short_description: Optional[str] = None
    category_id: str
    brand: Optional[str] = None
    price: float = Field(..., gt=0)
    sale_price: Optional[float] = None
    stock: int = Field(default=0, ge=0)
    sku: Optional[str] = None
    images: List[str] = Field(default_factory=list)
    featured: bool = False
    status: ProductStatus = ProductStatus.ACTIVE
    specifications: Optional[Dict[str, Any]] = None
    
    # New fields for product intelligence
    source: ProductSource = ProductSource.MANUAL
    source_url: Optional[str] = None
    trend_score: Optional[float] = Field(default=None, ge=0, le=100)
    ai_generated: bool = False
    last_synced_at: Optional[datetime] = None
    
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }


class ProductCreate(ProductModel):
    """Model for creating a new product"""
    id: Optional[str] = None
    slug: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class ProductUpdate(BaseModel):
    """Model for updating an existing product"""
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    slug: Optional[str] = None
    description: Optional[str] = Field(None, min_length=1)
    short_description: Optional[str] = None
    category_id: Optional[str] = None
    brand: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    sale_price: Optional[float] = None
    stock: Optional[int] = Field(None, ge=0)
    sku: Optional[str] = None
    images: Optional[List[str]] = None
    featured: Optional[bool] = None
    status: Optional[ProductStatus] = None
    specifications: Optional[Dict[str, Any]] = None
    source: Optional[ProductSource] = None
    source_url: Optional[str] = None
    trend_score: Optional[float] = Field(None, ge=0, le=100)
    ai_generated: Optional[bool] = None
    last_synced_at: Optional[datetime] = None


class CategoryModel(BaseModel):
    """Category model"""
    id: Optional[str] = None
    name: str = Field(..., min_length=1, max_length=200)
    slug: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class DuplicateDetectionResult(BaseModel):
    """Result of duplicate detection"""
    is_duplicate: bool
    confidence: float = Field(..., ge=0, le=1)
    matched_product: Optional[ProductModel] = None
    match_reasons: List[str] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)

"""
Image Manager
Handles image operations including upload, organization, and duplicate detection
"""

import logging
import hashlib
from pathlib import Path
from typing import Optional, List, Dict, Any
from PIL import Image
import io


logger = logging.getLogger(__name__)


class ImageManager:
    """Manages image operations"""
    
    def __init__(self, data_dir: Path):
        """
        Initialize image manager
        
        Args:
            data_dir: Base data directory
        """
        self.images_dir = data_dir / "images"
        self.images_dir.mkdir(exist_ok=True)
    
    def calculate_hash(self, image_path: Path) -> Optional[str]:
        """
        Calculate MD5 hash of an image file
        
        Args:
            image_path: Path to image file
            
        Returns:
            Hash string or None if failed
        """
        try:
            hash_md5 = hashlib.md5()
            with open(image_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except Exception as e:
            logger.error(f"Failed to calculate hash for {image_path}: {e}")
            return None
    
    def get_image_metadata(self, image_path: Path) -> Optional[Dict[str, Any]]:
        """
        Get metadata from an image file
        
        Args:
            image_path: Path to image file
            
        Returns:
            Dictionary with image metadata or None if failed
        """
        try:
            with Image.open(image_path) as img:
                return {
                    "width": img.width,
                    "height": img.height,
                    "format": img.format,
                    "mode": img.mode,
                    "size_bytes": image_path.stat().st_size,
                    "filename": image_path.name
                }
        except Exception as e:
            logger.error(f"Failed to get metadata for {image_path}: {e}")
            return None
    
    def resize_image(self, image_path: Path, max_width: int = 800,
                    max_height: int = 800, quality: int = 85) -> Optional[Path]:
        """
        Resize an image to maximum dimensions
        
        Args:
            image_path: Path to original image
            max_width: Maximum width
            max_height: Maximum height
            quality: JPEG quality (1-100)
            
        Returns:
            Path to resized image or None if failed
        """
        try:
            with Image.open(image_path) as img:
                # Calculate new dimensions
                img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
                
                # Create output path
                output_path = self.images_dir / f"resized_{image_path.name}"
                
                # Save resized image
                img.save(output_path, quality=quality, optimize=True)
                
                logger.info(f"Resized image: {image_path} -> {output_path}")
                return output_path
                
        except Exception as e:
            logger.error(f"Failed to resize image {image_path}: {e}")
            return None
    
    def convert_format(self, image_path: Path, target_format: str = "WEBP") -> Optional[Path]:
        """
        Convert image to different format
        
        Args:
            image_path: Path to original image
            target_format: Target format (WEBP, JPEG, PNG)
            
        Returns:
            Path to converted image or None if failed
        """
        try:
            with Image.open(image_path) as img:
                # Create output path
                output_path = self.images_dir / f"{image_path.stem}.{target_format.lower()}"
                
                # Convert and save
                if target_format.upper() == "WEBP":
                    img.save(output_path, format="WEBP", quality=85, optimize=True)
                elif target_format.upper() == "JPEG":
                    img.save(output_path, format="JPEG", quality=85, optimize=True)
                elif target_format.upper() == "PNG":
                    img.save(output_path, format="PNG", optimize=True)
                else:
                    logger.error(f"Unsupported format: {target_format}")
                    return None
                
                logger.info(f"Converted image: {image_path} -> {output_path}")
                return output_path
                
        except Exception as e:
            logger.error(f"Failed to convert image {image_path}: {e}")
            return None
    
    def organize_images(self, source_dir: Path, pattern: str = "*") -> Dict[str, Any]:
        """
        Organize images from source directory
        
        Args:
            source_dir: Source directory containing images
            pattern: File pattern to match
            
        Returns:
            Dictionary with organization results
        """
        results = {
            "total_found": 0,
            "processed": 0,
            "errors": 0,
            "organized": []
        }
        
        try:
            # Find images
            image_files = list(source_dir.glob(pattern))
            results["total_found"] = len(image_files)
            
            for image_path in image_files:
                try:
                    # Check if it's an image
                    with Image.open(image_path) as img:
                        # Create organized path
                        organized_path = self.images_dir / image_path.name
                        
                        # Copy if not exists
                        if not organized_path.exists():
                            import shutil
                            shutil.copy2(image_path, organized_path)
                        
                        results["organized"].append({
                            "original": str(image_path),
                            "organized": str(organized_path),
                            "hash": self.calculate_hash(organized_path)
                        })
                        results["processed"] += 1
                        
                except Exception as e:
                    logger.error(f"Failed to organize {image_path}: {e}")
                    results["errors"] += 1
            
            logger.info(f"Organized {results['processed']} images from {source_dir}")
            
        except Exception as e:
            logger.error(f"Failed to organize images from {source_dir}: {e}")
        
        return results
    
    def find_duplicates(self, directory: Optional[Path] = None) -> List[Dict[str, Any]]:
        """
        Find duplicate images by hash
        
        Args:
            directory: Directory to search (default: images_dir)
            
        Returns:
            List of duplicate groups
        """
        if directory is None:
            directory = self.images_dir
        
        hash_map = {}
        duplicates = []
        
        try:
            # Calculate hashes for all images
            for image_path in directory.glob("*"):
                if image_path.is_file():
                    image_hash = self.calculate_hash(image_path)
                    if image_hash:
                        if image_hash in hash_map:
                            hash_map[image_hash].append(image_path)
                        else:
                            hash_map[image_hash] = [image_path]
            
            # Find duplicates (hashes with multiple files)
            for image_hash, paths in hash_map.items():
                if len(paths) > 1:
                    duplicates.append({
                        "hash": image_hash,
                        "files": [str(p) for p in paths],
                        "count": len(paths)
                    })
            
            logger.info(f"Found {len(duplicates)} duplicate groups")
            
        except Exception as e:
            logger.error(f"Failed to find duplicates: {e}")
        
        return duplicates
    
    def find_unused_images(self, product_images: List[str]) -> List[str]:
        """
        Find images that are not used by any product
        
        Args:
            product_images: List of image URLs used by products
            
        Returns:
            List of unused image paths
        """
        unused = []
        
        try:
            # Get all local images
            local_images = [str(p) for p in self.images_dir.glob("*") if p.is_file()]
            
            # Check which are not used
            for local_image in local_images:
                # Simple check - in production, this would compare against Cloudinary URLs
                is_used = any(local_image in product_image for product_image in product_images)
                if not is_used:
                    unused.append(local_image)
            
            logger.info(f"Found {len(unused)} unused images")
            
        except Exception as e:
            logger.error(f"Failed to find unused images: {e}")
        
        return unused
    
    def batch_rename(self, pattern: str, replacement: str) -> Dict[str, Any]:
        """
        Batch rename images matching a pattern
        
        Args:
            pattern: Pattern to match in filenames
            replacement: Replacement string
            
        Returns:
            Dictionary with rename results
        """
        results = {
            "total": 0,
            "renamed": 0,
            "errors": 0,
            "changes": []
        }
        
        try:
            for image_path in self.images_dir.glob("*"):
                if image_path.is_file() and pattern in image_path.name:
                    try:
                        new_name = image_path.name.replace(pattern, replacement)
                        new_path = self.images_dir / new_name
                        
                        if not new_path.exists():
                            image_path.rename(new_path)
                            results["changes"].append({
                                "old": str(image_path),
                                "new": str(new_path)
                            })
                            results["renamed"] += 1
                        
                        results["total"] += 1
                        
                    except Exception as e:
                        logger.error(f"Failed to rename {image_path}: {e}")
                        results["errors"] += 1
            
            logger.info(f"Renamed {results['renamed']} images")
            
        except Exception as e:
            logger.error(f"Failed to batch rename: {e}")
        
        return results

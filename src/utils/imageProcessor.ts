import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

/**
 * Image Processor Utility
 * Process images with sharp - resize, convert, optimize
 */

export interface ProcessedImage {
  original: string; // Full size image path
  large: string; // Large size (1200px)
  medium: string; // Medium size (600px)
  small: string; // Small size (300px)
  thumbnail: string; // Tiny thumbnail (100px) - webp for smallest size
}

export interface ImageProcessOptions {
  baseDir: string; // Base directory to save images (e.g., 'storages/avatars')
  filename?: string; // Custom filename (optional, will generate UUID if not provided)
  quality?: number; // Image quality (1-100, default: 90)
}

/**
 * Process and save image in multiple sizes
 * Handles HEIC conversion automatically
 */
export async function processImage(
  buffer: Buffer,
  options: ImageProcessOptions
): Promise<ProcessedImage> {
  const {
    baseDir,
    filename = randomUUID(),
    quality = 90,
  } = options;

  // Ensure directory exists
  await fs.mkdir(baseDir, { recursive: true });

  // Initialize sharp instance
  const image = sharp(buffer);

  // Generate paths for different sizes
  const paths = {
    original: path.join(baseDir, `${filename}-original.webp`),
    large: path.join(baseDir, `${filename}-large.webp`),
    medium: path.join(baseDir, `${filename}-medium.webp`),
    small: path.join(baseDir, `${filename}-small.webp`),
    thumbnail: path.join(baseDir, `${filename}-thumb.webp`),
  };

  // Process and save original size (max 2000px) - WebP
  await image
    .resize(2000, 2000, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(paths.original);

  // Process and save large size (1200px) - WebP
  await sharp(buffer)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(paths.large);

  // Process and save medium size (600px) - WebP
  await sharp(buffer)
    .resize(600, 600, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85 })
    .toFile(paths.medium);

  // Process and save small size (300px) - WebP
  await sharp(buffer)
    .resize(300, 300, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toFile(paths.small);

  // Process and save thumbnail (100px) - WebP with very high compression
  await sharp(buffer)
    .resize(100, 100, {
      fit: 'cover', // Cover for perfect square thumbnail
      position: 'center',
    })
    .webp({ quality: 60, effort: 6 }) // Lower quality, higher effort for smaller file
    .toFile(paths.thumbnail);

  return paths;
}

/**
 * Delete all image sizes
 */
export async function deleteImageSizes(imagePaths: ProcessedImage): Promise<void> {
  const allPaths = [
    imagePaths.original,
    imagePaths.large,
    imagePaths.medium,
    imagePaths.small,
    imagePaths.thumbnail,
  ];

  // Delete all files, ignore errors if file doesn't exist
  await Promise.all(
    allPaths.map(async (filePath) => {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // Ignore if file doesn't exist
        if ((error as any).code !== 'ENOENT') {
          console.error(`Failed to delete ${filePath}:`, error);
        }
      }
    })
  );
}

/**
 * Delete image by filename pattern
 * Deletes all sizes of an image based on filename
 */
export async function deleteImageByFilename(
  baseDir: string,
  filename: string
): Promise<void> {
  const sizes = ['original', 'large', 'medium', 'small', 'thumb'];

  await Promise.all(
    sizes.map(async (size) => {
      const filePath = path.join(baseDir, `${filename}-${size}.webp`);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // Ignore if file doesn't exist
        if ((error as any).code !== 'ENOENT') {
          console.error(`Failed to delete ${filePath}:`, error);
        }
      }
    })
  );
}

/**
 * Extract filename from URL
 * e.g., /uploads/avatars/abc123-original.webp -> abc123
 */
export function extractFilenameFromUrl(url: string): string | null {
  const match = url.match(/([^\/]+)-(?:original|large|medium|small|thumb)\.webp$/);
  return match ? match[1] || null : null;
}

/**
 * Generate image URLs from paths
 */
export function generateImageUrls(
  imagePaths: ProcessedImage,
  baseUrl: string
): ProcessedImage {
  const relativePath = (fullPath: string) => {
    // Convert absolute path to relative URL
    // e.g., storages/avatars/abc-original.webp -> /uploads/avatars/abc-original.webp
    const relative = fullPath.replace(/\\/g, '/').replace('storages/', '/uploads/');
    return `${baseUrl}${relative}`;
  };

  return {
    original: relativePath(imagePaths.original),
    large: relativePath(imagePaths.large),
    medium: relativePath(imagePaths.medium),
    small: relativePath(imagePaths.small),
    thumbnail: relativePath(imagePaths.thumbnail),
  };
}

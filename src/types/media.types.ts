/**
 * Media Type Definitions
 * Based on Prisma schema Media model
 */

// ==================== REQUEST TYPES ====================

/**
 * Upload Media Request
 */
export interface UploadMediaRequest {
  altText?: string;
  caption?: string;
}

/**
 * Update Media Request
 */
export interface UpdateMediaRequest {
  altText?: string;
  caption?: string;
}

/**
 * Query parameters for media listing
 */
export interface MediaQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  mimeType?: string; // Filter by MIME type (e.g., 'image/jpeg', 'video/mp4')
  mimeTypePrefix?: string; // Filter by MIME prefix (e.g., 'image', 'video')
  userId?: string; // Filter by uploader
  sortBy?: 'createdAt' | 'fileName' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE TYPES ====================

/**
 * Processed Image Sizes
 */
export interface MediaImageSizes {
  original: string;
  large: string;
  medium: string;
  small: string;
  thumbnail: string;
}

/**
 * Media Response
 */
export interface MediaResponse {
  id: string;
  userId: string;
  fileName: string;
  filePath: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Additional processed image URLs (only for images)
  sizes?: MediaImageSizes;

  // User info (optional)
  user?: {
    id: string;
    name: string | null;
    username: string | null;
  };
}

/**
 * Media List Item Response (lightweight)
 */
export interface MediaListItemResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  altText: string | null;
  width: number | null;
  height: number | null;
  createdAt: Date;

  // Thumbnail URL for images
  thumbnailUrl?: string;
}

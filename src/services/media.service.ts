import { Prisma } from '@prisma/client';
import sharp from 'sharp';
import { prisma } from '../lib/prisma.js';
import type {
  UploadMediaRequest,
  UpdateMediaRequest,
  MediaResponse,
  MediaListItemResponse,
  MediaQueryParams,
  MediaImageSizes,
} from '../types/index.js';
import { PaginatedResult, ApiResponse } from '../types/response.types.js';
import {
  processImage,
  generateImageUrls,
  deleteImageByFilename,
  extractFilenameFromUrl,
} from '../utils/imageProcessor.js';
import { BadRequestError, NotFoundError, calculatePagination } from '../utils/index.js';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

/**
 * Media Service
 * Handles all media library operations (like WordPress media)
 */

// File size limits
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert Prisma Media to MediaResponse
 */
function toMediaResponse(media: any): MediaResponse {
  const response: MediaResponse = {
    id: media.id,
    userId: media.userId,
    fileName: media.fileName,
    filePath: media.filePath,
    fileUrl: media.fileUrl,
    mimeType: media.mimeType,
    fileSize: media.fileSize,
    altText: media.altText,
    caption: media.caption,
    width: media.width,
    height: media.height,
    createdAt: media.createdAt,
    updatedAt: media.updatedAt,
  };

  // Add user info if included
  if (media.user) {
    response.user = {
      id: media.user.id,
      name: media.user.name,
      username: media.user.username,
    };
  }

  return response;
}

/**
 * Convert to MediaListItemResponse
 */
function toMediaListItem(media: any): MediaListItemResponse {
  const item: MediaListItemResponse = {
    id: media.id,
    fileName: media.fileName,
    fileUrl: media.fileUrl,
    mimeType: media.mimeType,
    fileSize: media.fileSize,
    altText: media.altText,
    width: media.width,
    height: media.height,
    createdAt: media.createdAt,
  };

  // Add thumbnail URL for images
  if (media.mimeType.startsWith('image/')) {
    // Extract filename and construct thumbnail URL
    const urlParts = media.fileUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const baseFilename = filename.replace(/-original\.webp$/, '');
    const thumbnailUrl = media.fileUrl.replace(
      filename,
      `${baseFilename}-thumb.webp`
    );
    item.thumbnailUrl = thumbnailUrl;
  }

  return item;
}

/**
 * Check file size based on MIME type
 */
function validateFileSize(fileSize: number, mimeType: string): void {
  if (mimeType.startsWith('image/')) {
    if (fileSize > MAX_IMAGE_SIZE) {
      throw new BadRequestError(
        `Image file size exceeds maximum allowed size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
      );
    }
  } else if (mimeType.startsWith('video/')) {
    if (fileSize > MAX_VIDEO_SIZE) {
      throw new BadRequestError(
        `Video file size exceeds maximum allowed size of ${MAX_VIDEO_SIZE / 1024 / 1024}MB`
      );
    }
  } else {
    if (fileSize > MAX_DOCUMENT_SIZE) {
      throw new BadRequestError(
        `Document file size exceeds maximum allowed size of ${MAX_DOCUMENT_SIZE / 1024 / 1024}MB`
      );
    }
  }
}

// ==================== CRUD OPERATIONS ====================

/**
 * Upload Media
 * Handles images, videos, and documents
 */
export async function uploadMedia(
  userId: string,
  file: Express.Multer.File,
  data: UploadMediaRequest,
  baseUrl: string
): Promise<ApiResponse<MediaResponse>> {
  const { originalname, buffer, mimetype, size } = file;

  // Validate file size based on type
  validateFileSize(size, mimetype);

  let fileUrl: string;
  let filePath: string;
  let width: number | null = null;
  let height: number | null = null;
  let sizes: MediaImageSizes | undefined;

  // Handle images differently (process with sharp)
  if (mimetype.startsWith('image/')) {
    // Process image with sharp
    const processedImage = await processImage(buffer, {
      baseDir: 'storages/media',
    });

    filePath = processedImage.original;

    // Generate URLs
    const imageUrls = generateImageUrls(processedImage, baseUrl);
    fileUrl = imageUrls.large; // Use large as main URL
    sizes = imageUrls;

    // Get image dimensions
    const metadata = await sharp(buffer).metadata();
    width = metadata.width || null;
    height = metadata.height || null;
  } else {
    // Handle videos and documents (save directly)
    const filename = `${randomUUID()}-${originalname}`;
    const baseDir = mimetype.startsWith('video/')
      ? 'storages/media/videos'
      : 'storages/media/documents';

    // Ensure directory exists
    await fs.mkdir(baseDir, { recursive: true });

    filePath = path.join(baseDir, filename);

    // Save file
    await fs.writeFile(filePath, buffer);

    // Generate URL
    const relativePath = filePath.replace(/\\/g, '/').replace('storages/', '/uploads/');
    fileUrl = `${baseUrl}${relativePath}`;

    // Get video dimensions if it's a video (would need ffprobe, skip for now)
    // For now, width and height remain null for videos and documents
  }

  // Create media record
  const media = await prisma.media.create({
    data: {
      userId,
      fileName: originalname,
      filePath,
      fileUrl,
      mimeType: mimetype,
      fileSize: size,
      altText: data.altText || null,
      caption: data.caption || null,
      width,
      height,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  const response = toMediaResponse(media);
  if (sizes) {
    response.sizes = sizes;
  }

  return {
    success: true,
    message: 'Media uploaded successfully',
    data: response,
  };
}

/**
 * Get Media by ID
 */
export async function getMediaById(mediaId: string): Promise<ApiResponse<MediaResponse>> {
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  if (!media) {
    throw new NotFoundError(`Media with ID '${mediaId}' not found`);
  }

  // Get image sizes if it's an image
  let sizes: MediaImageSizes | undefined;
  if (media.mimeType.startsWith('image/')) {
    const filename = extractFilenameFromUrl(media.fileUrl);
    if (filename) {
      sizes = {
        original: media.fileUrl.replace(/-large\.webp$/, '-original.webp'),
        large: media.fileUrl,
        medium: media.fileUrl.replace(/-large\.webp$/, '-medium.webp'),
        small: media.fileUrl.replace(/-large\.webp$/, '-small.webp'),
        thumbnail: media.fileUrl.replace(/-large\.webp$/, '-thumb.webp'),
      };
    }
  }

  const response = toMediaResponse(media);
  if (sizes) {
    response.sizes = sizes;
  }

  return {
    success: true,
    message: 'Media retrieved successfully',
    data: response,
  };
}

/**
 * Get All Media with Pagination and Filtering
 */
export async function getAllMedia(
  query: MediaQueryParams
): Promise<ApiResponse<PaginatedResult<MediaListItemResponse>>> {
  const {
    page = 1,
    limit = 20,
    search,
    mimeType,
    mimeTypePrefix,
    userId,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // Ensure numbers
  const pageNum = typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum = typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: Prisma.MediaWhereInput = {};

  if (userId) {
    where.userId = userId;
  }

  if (mimeType) {
    where.mimeType = mimeType;
  } else if (mimeTypePrefix) {
    where.mimeType = {
      startsWith: mimeTypePrefix,
    };
  }

  if (search) {
    where.OR = [
      { fileName: { contains: search, mode: 'insensitive' } },
      { altText: { contains: search, mode: 'insensitive' } },
      { caption: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build order by
  const orderBy: Prisma.MediaOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute queries in parallel
  const [media, totalItems] = await Promise.all([
    prisma.media.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
    }),
    prisma.media.count({ where }),
  ]);

  const pagination = calculatePagination(totalItems, pageNum, limitNum);

  return {
    success: true,
    message: 'Media retrieved successfully',
    data: {
      data: media.map(toMediaListItem),
      pagination,
    },
  };
}

/**
 * Update Media
 * Updates metadata (altText, caption) only
 */
export async function updateMedia(
  mediaId: string,
  userId: string,
  userRole: string,
  data: UpdateMediaRequest
): Promise<ApiResponse<MediaResponse>> {
  // Find existing media
  const existingMedia = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!existingMedia) {
    throw new NotFoundError(`Media with ID '${mediaId}' not found`);
  }

  // Check ownership (non-admin users can only update their own media)
  if (userRole !== 'ADMIN' && existingMedia.userId !== userId) {
    throw new BadRequestError('You do not have permission to update this media');
  }

  // Update media
  const media = await prisma.media.update({
    where: { id: mediaId },
    data: {
      altText: data.altText !== undefined ? data.altText : undefined,
      caption: data.caption !== undefined ? data.caption : undefined,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Media updated successfully',
    data: toMediaResponse(media),
  };
}

/**
 * Delete Media
 * Deletes file and database record
 */
export async function deleteMedia(
  mediaId: string,
  userId: string,
  userRole: string
): Promise<ApiResponse<null>> {
  // Find existing media
  const media = await prisma.media.findUnique({
    where: { id: mediaId },
  });

  if (!media) {
    throw new NotFoundError(`Media with ID '${mediaId}' not found`);
  }

  // Check ownership (non-admin users can only delete their own media)
  if (userRole !== 'ADMIN' && media.userId !== userId) {
    throw new BadRequestError('You do not have permission to delete this media');
  }

  // Delete file(s) from storage
  if (media.mimeType.startsWith('image/')) {
    // Delete all image sizes
    const filename = extractFilenameFromUrl(media.fileUrl);
    if (filename) {
      await deleteImageByFilename('storages/media', filename);
    }
  } else {
    // Delete single file (video/document)
    try {
      await fs.unlink(media.filePath);
    } catch (error) {
      console.error(`Failed to delete file ${media.filePath}:`, error);
    }
  }

  // Delete database record
  await prisma.media.delete({
    where: { id: mediaId },
  });

  return {
    success: true,
    message: 'Media deleted successfully',
    data: null,
  };
}

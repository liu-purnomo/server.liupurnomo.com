import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/errors.js';

/**
 * Upload Middleware
 * Multer configuration for file uploads
 */

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/gif',
  'image/svg+xml',
];

// Allowed video MIME types
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mpeg',
  'video/webm',
  'video/quicktime',
];

// Allowed document MIME types
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// All allowed media types
const ALLOWED_MEDIA_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
  ...ALLOWED_DOCUMENT_TYPES,
];

// Maximum file sizes
const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB for images
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB for videos
// const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB for documents (reserved for future use)
const MAX_FILE_SIZE = MAX_IMAGE_SIZE; // Default

/**
 * File filter for images only
 */
const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  // Check if file type is allowed
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Invalid file type. Only JPEG, PNG, WebP, and HEIC are allowed. Received: ${file.mimetype}`
      )
    );
  }
};

/**
 * Multer storage configuration
 * Using memory storage for processing with sharp before saving
 */
const storage = multer.memoryStorage();

/**
 * Multer upload instance for avatar
 */
export const uploadAvatar = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single('avatar');

/**
 * Multer upload instance for category icon
 */
export const uploadCategoryIcon = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single('icon');

/**
 * Multer upload instance for multiple images
 */
export const uploadImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 10, // Maximum 10 files
  },
}).array('images', 10);

/**
 * Multer upload instance for post creation
 * Handles featuredImage and ogImage uploads
 */
export const uploadPostImages = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 2, // Maximum 2 files (featuredImage + ogImage)
  },
}).fields([
  { name: 'featuredImage', maxCount: 1 },
  { name: 'ogImage', maxCount: 1 },
]);

/**
 * File filter for any media (images, videos, documents)
 */
const mediaFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (ALLOWED_MEDIA_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        `Invalid file type. Allowed types: images, videos (MP4, WebM), and documents (PDF, Word, Excel). Received: ${file.mimetype}`
      )
    );
  }
};

/**
 * Multer upload instance for media library
 * Supports images, videos, and documents with appropriate size limits
 */
export const uploadMedia = multer({
  storage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Use largest limit, will validate per type in service
  },
}).single('file');

/**
 * Multer upload instance for multiple media files
 * Supports up to 20 files at once for bulk upload
 */
export const uploadMediaBulk = multer({
  storage,
  fileFilter: mediaFileFilter,
  limits: {
    fileSize: MAX_VIDEO_SIZE, // Use largest limit, will validate per type in service
    files: 20, // Maximum 20 files per request
  },
}).array('files', 20);

/**
 * Error handler for multer errors
 */
export const handleMulterError = (error: any, _req: Request): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      throw new BadRequestError(
        `File size too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
      );
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      throw new BadRequestError('Too many files. Maximum is 10 files');
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      throw new BadRequestError('Unexpected field name');
    } else {
      throw new BadRequestError(`Upload error: ${error.message}`);
    }
  } else {
    throw error;
  }
};

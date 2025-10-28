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
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

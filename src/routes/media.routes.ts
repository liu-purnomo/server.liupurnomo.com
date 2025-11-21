import { Router } from 'express';
import * as mediaController from '../controllers/media.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { uploadMedia, uploadMediaBulk } from '../middlewares/upload.js';
import {
  uploadMediaValidator,
  updateMediaValidator,
  getMediaByIdValidator,
  deleteMediaValidator,
  getMediaQueryValidator,
} from '../validators/index.js';

/**
 * Media Routes
 * WordPress-like media library
 */
const router = Router();

// ==================== PUBLIC ROUTES ====================

/**
 * GET /api/media
 * Get all media with pagination and filtering
 */
router.get(
  '/',
  validate(getMediaQueryValidator, 'query'),
  mediaController.getAllMedia
);

/**
 * GET /api/media/:id
 * Get single media by ID
 */
router.get(
  '/:id',
  validate(getMediaByIdValidator, 'params'),
  mediaController.getMediaById
);

// ==================== AUTHOR/ADMIN ROUTES ====================

/**
 * POST /api/media
 * Upload new media (images, videos, documents)
 * Auth Required: AUTHOR, ADMIN
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  (req, res, next) => {
    uploadMedia(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  },
  validate(uploadMediaValidator),
  mediaController.uploadMedia
);

/**
 * POST /api/media/bulk
 * Bulk upload multiple media files (up to 20 at once)
 * Auth Required: AUTHOR, ADMIN
 */
router.post(
  '/bulk',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  (req, res, next) => {
    uploadMediaBulk(req, res, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  },
  mediaController.uploadMediaBulk
);

/**
 * POST /api/media/:id/rotate
 * Rotate image by specified degrees (90, 180, 270)
 * Auth Required: Owner or ADMIN
 */
router.post(
  '/:id/rotate',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getMediaByIdValidator, 'params'),
  mediaController.rotateMedia
);

/**
 * PATCH /api/media/:id
 * Update media metadata (altText, caption)
 * Auth Required: Owner or ADMIN
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(getMediaByIdValidator, 'params'),
  validate(updateMediaValidator),
  mediaController.updateMedia
);

/**
 * DELETE /api/media/:id
 * Delete media (file + database record)
 * Auth Required: Owner or ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(deleteMediaValidator, 'params'),
  mediaController.deleteMedia
);

export default router;

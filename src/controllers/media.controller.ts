import { Request, Response } from 'express';
import * as mediaService from '../services/media.service.js';
import {
  asyncHandler,
  logActivity,
  sendSuccess,
  sendCreated,
  BadRequestError,
} from '../utils/index.js';
import {
  UploadMediaInput,
  UpdateMediaInput,
  GetMediaByIdInput,
  DeleteMediaInput,
  GetMediaQueryInput,
} from '../validators/media.validator.js';

/**
 * Media Controller
 * Handles HTTP requests for media library operations
 */

/**
 * Upload Media
 * POST /api/media
 * Auth Required (AUTHOR, ADMIN)
 */
export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const file = req.file;

  if (!file) {
    throw new BadRequestError('File is required');
  }

  const data: UploadMediaInput = req.body;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const result = await mediaService.uploadMedia(userId, file, data, baseUrl);

  // Log activity
  await logActivity({
    userId,
    action: 'CREATE',
    entity: 'Media',
    entityId: result.data!.id,
    description: `Uploaded media: ${result.data!.fileName}`,
    newData: {
      fileName: result.data!.fileName,
      mimeType: result.data!.mimeType,
      fileSize: result.data!.fileSize,
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendCreated(res, result.message, { media: result.data });
});

/**
 * Bulk Upload Media
 * POST /api/media/bulk
 * Auth Required (AUTHOR, ADMIN)
 */
export const uploadMediaBulk = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new BadRequestError('At least one file is required');
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  const result = await mediaService.uploadMediaBulk(userId, files, baseUrl);

  // Log activity for successful uploads
  if (result.data && result.data.length > 0) {
    const uploadedMedia = result.data;
    await logActivity({
      userId,
      action: 'CREATE',
      entity: 'Media',
      entityId: uploadedMedia[0]!.id,
      description: `Bulk uploaded ${uploadedMedia.length} media file(s)`,
      newData: {
        fileCount: uploadedMedia.length,
        fileNames: uploadedMedia.map((m) => m.fileName),
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  return sendCreated(res, result.message, {
    media: result.data,
    errors: (result as any).errors,
  });
});

/**
 * Get All Media
 * GET /api/media
 * Public (with pagination and filtering)
 */
export const getAllMedia = asyncHandler(async (req: Request, res: Response) => {
  const query: GetMediaQueryInput = req.query as any;

  const result = await mediaService.getAllMedia(query);

  return sendSuccess(res, 200, result.message, result.data);
});

/**
 * Get Media by ID
 * GET /api/media/:id
 * Public
 */
export const getMediaById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params as GetMediaByIdInput;

  const result = await mediaService.getMediaById(id);

  return sendSuccess(res, 200, result.message, { media: result.data });
});

/**
 * Update Media Metadata
 * PATCH /api/media/:id
 * Auth Required (Owner or ADMIN)
 */
export const updateMedia = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { id } = req.params as GetMediaByIdInput;
  const data: UpdateMediaInput = req.body;

  const result = await mediaService.updateMedia(id, userId, userRole, data);

  // Log activity
  await logActivity({
    userId,
    action: 'UPDATE',
    entity: 'Media',
    entityId: id,
    description: `Updated media metadata for: ${result.data!.fileName}`,
    newData: {
      altText: data.altText,
      caption: data.caption,
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, result.message, { media: result.data });
});

/**
 * Delete Media
 * DELETE /api/media/:id
 * Auth Required (Owner or ADMIN)
 */
export const deleteMedia = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const { id } = req.params as DeleteMediaInput;

  // Get media info before deleting for logging
  const mediaInfo = await mediaService.getMediaById(id);

  const result = await mediaService.deleteMedia(id, userId, userRole);

  // Log activity
  await logActivity({
    userId,
    action: 'DELETE',
    entity: 'Media',
    entityId: id,
    description: `Deleted media: ${mediaInfo.data!.fileName}`,
    oldData: {
      fileName: mediaInfo.data!.fileName,
      mimeType: mediaInfo.data!.mimeType,
    },
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, result.message, null);
});

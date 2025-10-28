import { Request, Response, NextFunction } from 'express';
import * as tagService from '../services/tag.service.js';
import type {
  CreateTagInput,
  GetTagsQuery,
  UpdateTagInput,
} from '../validators/tag.validator.js';

/**
 * Tag Controller
 * Handles HTTP requests for tag operations
 */

// ==================== CREATE ====================

/**
 * Create a new tag
 * POST /api/tags
 */
export async function createTag(
  req: Request<object, object, CreateTagInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tag = await tagService.createTag(req.body);

    res.status(201).json({
      success: true,
      message: 'Tag created successfully',
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
}

// ==================== READ ====================

/**
 * Get all tags with pagination
 * GET /api/tags
 */
export async function getAllTags(
  req: Request<object, object, object, GetTagsQuery>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await tagService.getAllTags(req.query);

    res.status(200).json({
      success: true,
      message: 'Tags retrieved successfully',
      data: result,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get tag by ID
 * GET /api/tags/:id
 */
export async function getTagById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tag = await tagService.getTagById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Tag retrieved successfully',
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get tag by slug
 * GET /api/tags/slug/:slug
 */
export async function getTagBySlug(
  req: Request<{ slug: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tag = await tagService.getTagBySlug(req.params.slug);

    res.status(200).json({
      success: true,
      message: 'Tag retrieved successfully',
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
}

// ==================== UPDATE ====================

/**
 * Update a tag
 * PATCH /api/tags/:id
 */
export async function updateTag(
  req: Request<{ id: string }, object, UpdateTagInput>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tag = await tagService.updateTag(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Tag updated successfully',
      data: { tag },
    });
  } catch (error) {
    next(error);
  }
}

// ==================== DELETE ====================

/**
 * Delete a tag
 * DELETE /api/tags/:id
 */
export async function deleteTag(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await tagService.deleteTag(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

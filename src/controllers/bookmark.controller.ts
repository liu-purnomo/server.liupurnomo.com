import type { Request, Response, NextFunction } from 'express';
import * as bookmarkService from '../services/bookmark.service.js';
import type {
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
  BookmarkQueryParams,
} from '../types/index.js';
import {
  sendCreated,
  sendSuccess,
  sendPaginatedSuccess,
} from '../utils/index.js';

/**
 * Bookmark Controller
 */

/**
 * Create Bookmark
 * POST /api/bookmarks
 */
export async function createBookmark(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const data: CreateBookmarkRequest = req.body;
    const result = await bookmarkService.createBookmark(userId, data);

    sendCreated(res, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get Bookmark by ID
 * GET /api/bookmarks/:id
 */
export async function getBookmarkById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await bookmarkService.getBookmarkById(userId, id!);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get Bookmark by Post ID
 * GET /api/bookmarks/post/:postId
 */
export async function getBookmarkByPostId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { postId } = req.params;
    const result = await bookmarkService.getBookmarkByPostId(userId, postId!);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get All Bookmarks for User
 * GET /api/bookmarks
 */
export async function getAllBookmarks(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const query: BookmarkQueryParams = req.query;
    const result = await bookmarkService.getAllBookmarks(userId, query);

    sendPaginatedSuccess(
      res,
      'Bookmarks retrieved successfully',
      result.data,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Update Bookmark
 * PATCH /api/bookmarks/:id
 */
export async function updateBookmark(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data: UpdateBookmarkRequest = req.body;
    const result = await bookmarkService.updateBookmark(userId, id!, data);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Bookmark
 * DELETE /api/bookmarks/:id
 */
export async function deleteBookmark(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await bookmarkService.deleteBookmark(userId, id!);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Read Status
 * POST /api/bookmarks/:id/toggle-read
 */
export async function toggleReadStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await bookmarkService.toggleReadStatus(userId, id!);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Favorite
 * POST /api/bookmarks/:id/toggle-favorite
 */
export async function toggleFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const result = await bookmarkService.toggleFavorite(userId, id!);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

import type { NextFunction, Request, Response } from 'express';
import * as bookmarkService from '../services/bookmark.service.js';
import { CachePrefix, CacheService } from '../services/cache.service.js';

import { prisma } from '../lib/prisma.js';
import type {
  BookmarkQueryParams,
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
} from '../types/index.js';
import {
  sendCreated,
  sendPaginatedSuccess,
  sendSuccess,
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

    // Invalidate post cache to reflect bookmark status
    await Promise.all([
      CacheService.invalidateEntity(CachePrefix.POST, data.postId),
      CacheService.invalidateEntity(CachePrefix.POST_LIST),
    ]);

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
    const id = req.params.id as string;
    const result = await bookmarkService.getBookmarkById(userId, id);

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
    const postId = req.params.postId as string;
    const result = await bookmarkService.getBookmarkByPostId(userId, postId);

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
    const id = req.params.id as string;
    const data: UpdateBookmarkRequest = req.body;
    const result = await bookmarkService.updateBookmark(userId, id, data);

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
    const id = req.params.id as string;

    // Get postId before deleting
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      select: { postId: true },
    });

    const result = await bookmarkService.deleteBookmark(userId, id);

    // Invalidate post cache to reflect bookmark status
    if (bookmark?.postId) {
      await Promise.all([
        CacheService.invalidateEntity(CachePrefix.POST, bookmark.postId),
        CacheService.invalidateEntity(CachePrefix.POST_LIST),
      ]);
    }

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
    const id = req.params.id as string;
    const result = await bookmarkService.toggleReadStatus(userId, id);

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
    const id = req.params.id as string;
    const result = await bookmarkService.toggleFavorite(userId, id);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

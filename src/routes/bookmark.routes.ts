import { Router } from 'express';
import * as bookmarkController from '../controllers/bookmark.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import {
  createBookmarkSchema,
  updateBookmarkSchema,
  getBookmarkByIdSchema,
  getAllBookmarksSchema,
  deleteBookmarkSchema,
  toggleReadStatusSchema,
  toggleFavoriteSchema,
} from '../validators/bookmark.validator.js';

const router = Router();

/**
 * Bookmark Routes
 * All routes require authentication
 */

/**
 * @route   GET /api/bookmarks
 * @desc    Get all bookmarks for authenticated user
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  validate(getAllBookmarksSchema),
  bookmarkController.getAllBookmarks
);

/**
 * @route   POST /api/bookmarks
 * @desc    Create new bookmark
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validate(createBookmarkSchema),
  bookmarkController.createBookmark
);

/**
 * @route   GET /api/bookmarks/:id
 * @desc    Get bookmark by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  validate(getBookmarkByIdSchema),
  bookmarkController.getBookmarkById
);

/**
 * @route   PATCH /api/bookmarks/:id
 * @desc    Update bookmark
 * @access  Private
 */
router.patch(
  '/:id',
  authenticate,
  validate(updateBookmarkSchema),
  bookmarkController.updateBookmark
);

/**
 * @route   DELETE /api/bookmarks/:id
 * @desc    Delete bookmark
 * @access  Private
 */
router.delete(
  '/:id',
  authenticate,
  validate(deleteBookmarkSchema),
  bookmarkController.deleteBookmark
);

/**
 * @route   POST /api/bookmarks/:id/toggle-read
 * @desc    Toggle read status
 * @access  Private
 */
router.post(
  '/:id/toggle-read',
  authenticate,
  validate(toggleReadStatusSchema),
  bookmarkController.toggleReadStatus
);

/**
 * @route   POST /api/bookmarks/:id/toggle-favorite
 * @desc    Toggle favorite status
 * @access  Private
 */
router.post(
  '/:id/toggle-favorite',
  authenticate,
  validate(toggleFavoriteSchema),
  bookmarkController.toggleFavorite
);

export default router;

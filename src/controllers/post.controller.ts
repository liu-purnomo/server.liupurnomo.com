import { Request, Response } from 'express';
import { CachePrefix, CacheService, CacheTTL } from '../services/cache.service.js';
import { postService } from '../services/index.js';
import {
  asyncHandler,
  logActivity,
  sendCreated,
  sendSuccess,
} from '../utils/index.js';
import type {
  CreatePostRequest,
  UpdatePostRequest,
  PostQueryParams,
} from '../types/index.js';

/**
 * Post Controllers
 * Handle HTTP requests for post management operations
 */

// ==================== PUBLIC POST ENDPOINTS ====================

/**
 * Get All Posts (Paginated)
 * GET /api/posts
 * Public access - returns only published posts
 */
export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const query: PostQueryParams = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    search: req.query.search as string,
    categoryId: req.query.categoryId as string,
    categorySlug: req.query.categorySlug as string,
    tagId: req.query.tagId as string,
    tagSlug: req.query.tagSlug as string,
    authorId: req.query.authorId as string,
    authorUsername: req.query.authorUsername as string,
    status: req.query.status as any,
    postType: req.query.postType as any,
    difficultyLevel: req.query.difficultyLevel as any,
    sortBy: (req.query.sortBy as any) || 'publishedAt',
    sortOrder: (req.query.sortOrder as any) || 'desc',
  };

  // Build cache key from query parameters
  const cacheKey = CacheService.buildKey(
    CachePrefix.POST_LIST,
    JSON.stringify(query)
  );

  const result = await CacheService.getOrSet(
    cacheKey,
    () => postService.getAllPosts(query, false),
    CacheTTL.FIVE_MINUTES // Cache for 5 minutes
  );

  return sendSuccess(
    res,
    200,
    result.message,
    { posts: result.data!.data },
    result.data!.pagination
  );
});

/**
 * Get Post by ID
 * GET /api/posts/:id
 * Public access - returns only published posts
 */
export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await postService.getPostById(id, false);

  // Increment view count asynchronously
  postService.incrementViewCount(id).catch((err) => {
    console.error('Failed to increment view count:', err);
  });

  return sendSuccess(res, 200, result.message, { post: result.data });
});

/**
 * Get Post by Slug
 * GET /api/posts/slug/:slug
 * Public access - returns only published posts
 * Returns post with related posts and latest posts
 */
export const getPostBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const userId = req.user?.id; // Optional auth

  // Build cache key (include userId for personalized data like isBookmarked)
  const cacheKey = CacheService.buildKey(
    CachePrefix.POST,
    'slug',
    slug,
    userId || 'guest'
  );

  const result = await CacheService.getOrSet(
    cacheKey,
    () => postService.getPostBySlug(slug, false, userId),
    CacheTTL.FIFTEEN_MINUTES // Cache for 15 minutes
  );

  // Increment view count asynchronously (result.data is PostDetailResponse)
  postService.incrementViewCount(result.data!.post.id).catch((err) => {
    console.error('Failed to increment view count:', err);
  });

  return sendSuccess(res, 200, result.message, result.data);
});

// ==================== AUTHOR/ADMIN POST ENDPOINTS ====================

/**
 * Create Post
 * POST /api/posts
 * Requires authentication and AUTHOR or ADMIN role
 * Images are URLs from media library (JSON body)
 */
export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const postData: CreatePostRequest = req.body;

  const result = await postService.createPost(userId, postData);

  // Invalidate post caches
  await Promise.all([
    CacheService.invalidateEntity(CachePrefix.POST),
    CacheService.invalidateEntity(CachePrefix.POST_LIST),
    CacheService.delete(CachePrefix.SITEMAP), // Sitemap includes posts
    CacheService.invalidateEntity(CachePrefix.USER_STATS, result.data!.authorId),
  ]);

  // Log activity
  await logActivity({
    userId,
    action: 'CREATE',
    entity: 'Post',
    entityId: result.data!.id,
    description: `Created post: ${result.data!.title}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendCreated(res, result.message, { post: result.data });
});

/**
 * Get All Posts (Admin/Author - includes drafts)
 * GET /api/posts/admin/all
 * Requires authentication and AUTHOR or ADMIN role
 */
export const getAllPostsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const query: PostQueryParams = {
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    search: req.query.search as string,
    categoryId: req.query.categoryId as string,
    categorySlug: req.query.categorySlug as string,
    tagId: req.query.tagId as string,
    tagSlug: req.query.tagSlug as string,
    authorId: req.query.authorId as string,
    authorUsername: req.query.authorUsername as string,
    status: req.query.status as any,
    postType: req.query.postType as any,
    difficultyLevel: req.query.difficultyLevel as any,
    sortBy: (req.query.sortBy as any) || 'createdAt',
    sortOrder: (req.query.sortOrder as any) || 'desc',
  };

  // If user is AUTHOR (not ADMIN), only show their own posts
  if (userRole === 'AUTHOR') {
    query.authorId = userId;
  }

  const result = await postService.getAllPosts(query, true);

  return sendSuccess(
    res,
    200,
    result.message,
    { posts: result.data!.data },
    result.data!.pagination
  );
});

/**
 * Get Post by ID (Admin/Author - includes drafts)
 * GET /api/posts/admin/:id
 * Requires authentication and AUTHOR or ADMIN role
 */
export const getPostByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  const result = await postService.getPostById(id, true);

  // If user is AUTHOR (not ADMIN), verify they own the post
  if (userRole === 'AUTHOR' && result.data!.authorId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to access this post',
    });
  }

  return sendSuccess(res, 200, result.message, { post: result.data });
});

/**
 * Update Post
 * PUT /api/posts/:id
 * Requires authentication and AUTHOR or ADMIN role
 */
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const userRole = req.user!.role;
  const postData: UpdatePostRequest = req.body;

  // First, get the post to check ownership
  const existingPost = await postService.getPostById(id, true);

  // If user is AUTHOR (not ADMIN), verify they own the post
  if (userRole === 'AUTHOR' && existingPost.data!.authorId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to update this post',
    });
  }

  const result = await postService.updatePost(id, postData);

  // Invalidate post caches
  await Promise.all([
    CacheService.invalidateEntity(CachePrefix.POST, id),
    CacheService.invalidateEntity(CachePrefix.POST_LIST),
    CacheService.delete(CachePrefix.SITEMAP),
    CacheService.invalidateEntity(CachePrefix.USER_STATS, result.data!.authorId),
  ]);

  // Log activity
  await logActivity({
    userId,
    action: 'UPDATE',
    entity: 'Post',
    entityId: id,
    description: `Updated post: ${result.data!.title}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, result.message, { post: result.data });
});

/**
 * Delete Post (Soft Delete)
 * DELETE /api/posts/:id
 * Requires authentication and AUTHOR or ADMIN role
 */
export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.userId;
  const userRole = req.user!.role;

  // First, get the post to check ownership
  const existingPost = await postService.getPostById(id, true);

  // If user is AUTHOR (not ADMIN), verify they own the post
  if (userRole === 'AUTHOR' && existingPost.data!.authorId !== userId) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this post',
    });
  }

  await postService.deletePost(id);

  // Invalidate post caches
  await Promise.all([
    CacheService.invalidateEntity(CachePrefix.POST, id),
    CacheService.invalidateEntity(CachePrefix.POST_LIST),
    CacheService.delete(CachePrefix.SITEMAP),
    CacheService.invalidateEntity(CachePrefix.USER_STATS, existingPost.data!.authorId),
  ]);

  // Log activity
  await logActivity({
    userId,
    action: 'DELETE',
    entity: 'Post',
    entityId: id,
    description: `Deleted post: ${existingPost.data!.title}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, 'Post deleted successfully', null);
});

/**
 * Permanently Delete Post
 * DELETE /api/posts/:id/permanent
 * Requires authentication and ADMIN role only
 */
export const permanentlyDeletePost = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.userId;

  const existingPost = await postService.getPostById(id, true);

  await postService.permanentlyDeletePost(id);

  // Log activity
  await logActivity({
    userId,
    action: 'DELETE',
    entity: 'Post',
    entityId: id,
    description: `Permanently deleted post: ${existingPost.data!.title}`,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  return sendSuccess(res, 200, 'Post permanently deleted', null);
});

// ==================== AUTOCOMPLETE/SEARCH ENDPOINTS ====================

/**
 * Search Posts for Internal Link/Autocomplete
 * GET /api/posts/search
 * Public access - returns limited post info for internal linking
 * Query params: q (search query), limit (default 10)
 */
export const searchPosts = asyncHandler(async (req: Request, res: Response) => {
  const { q = '', limit = '10' } = req.query;
  const searchQuery = q as string;
  const limitNum = parseInt(limit as string, 10);

  const posts = await postService.searchPostsForLink(searchQuery, limitNum);

  return sendSuccess(res, 200, 'Posts retrieved successfully', { posts });
});

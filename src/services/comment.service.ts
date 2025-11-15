/**
 * Comment Service
 * Business logic for comment management
 * Supports authenticated users and guests with approval workflow
 */

import { prisma } from '../lib/prisma.js';
import {
  CommentResponse,
  CommentListItem,
  CreateCommentInput,
  CreateGuestCommentInput,
  UpdateCommentInput,
  ModerateCommentInput,
  CommentQueryParams,
} from '../types/comment.types.js';
import { ApiResponse, PaginatedResult } from '../types/response.types.js';
import { AppError } from '../utils/errors.js';
import { calculatePagination } from '../utils/apiResponse.js';

/**
 * Helper: Extract plain text from JSON content
 * Recursively extracts all text values from JSON object
 */
function extractPlainText(content: any): string {
  if (!content) return '';

  if (typeof content === 'string') {
    return content;
  }

  if (typeof content === 'number' || typeof content === 'boolean') {
    return String(content);
  }

  if (Array.isArray(content)) {
    return content.map(extractPlainText).join(' ');
  }

  if (typeof content === 'object') {
    return Object.values(content).map(extractPlainText).join(' ');
  }

  return '';
}

/**
 * Helper: Calculate word count from plain text
 */
function calculateWordCount(text: string): number {
  // Remove HTML tags and extra whitespace
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (!cleanText) return 0;

  return cleanText.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Create comment (authenticated user)
 * Automatically approved if user is post author
 */
export async function createComment(
  data: CreateCommentInput,
  userId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<ApiResponse<{ comment: CommentResponse }>> {
  // Verify post exists
  const post = await prisma.post.findUnique({
    where: { id: data.postId },
    select: { id: true, authorId: true, status: true, deletedAt: true },
  });

  if (!post || post.deletedAt) {
    throw new AppError('Post not found', 404);
  }

  if (post.status !== 'PUBLISHED') {
    throw new AppError('Cannot comment on unpublished post', 403);
  }

  // Verify parent comment if provided
  if (data.parentId) {
    const parent = await prisma.comment.findFirst({
      where: {
        id: data.parentId,
        postId: data.postId,
        deletedAt: null,
      },
    });

    if (!parent) {
      throw new AppError('Parent comment not found', 404);
    }
  }

  // Extract plain text and calculate word count
  const contentText = extractPlainText(data.content);
  const wordCount = calculateWordCount(contentText);

  // Check if user is post author (auto-approve)
  const isAuthor = post.authorId === userId;

  // Create comment
  const comment = await prisma.comment.create({
    data: {
      postId: data.postId,
      userId,
      parentId: data.parentId,
      content: data.content,
      contentText,
      wordCount,
      isApproved: isAuthor, // Auto-approve if post author
      isAuthorReply: isAuthor,
      ipAddress,
      userAgent,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          replies: true,
          commentReactions: true,
        },
      },
    },
  });

  // Update parent comment reply count if this is a reply
  if (data.parentId) {
    await prisma.comment.update({
      where: { id: data.parentId },
      data: {
        replyCount: {
          increment: 1,
        },
      },
    });
  }

  return {
    success: true,
    message: isAuthor
      ? 'Comment created and published successfully'
      : 'Comment created and pending approval',
    data: { comment },
  };
}

/**
 * Create guest comment (unauthenticated)
 * Requires approval before being visible
 */
export async function createGuestComment(
  data: CreateGuestCommentInput,
  ipAddress?: string,
  userAgent?: string,
  referrer?: string
): Promise<ApiResponse<{ comment: CommentResponse }>> {
  // Verify post exists
  const post = await prisma.post.findUnique({
    where: { id: data.postId },
    select: { id: true, status: true, deletedAt: true },
  });

  if (!post || post.deletedAt) {
    throw new AppError('Post not found', 404);
  }

  if (post.status !== 'PUBLISHED') {
    throw new AppError('Cannot comment on unpublished post', 403);
  }

  // Verify parent comment if provided
  if (data.parentId) {
    const parent = await prisma.comment.findFirst({
      where: {
        id: data.parentId,
        postId: data.postId,
        deletedAt: null,
      },
    });

    if (!parent) {
      throw new AppError('Parent comment not found', 404);
    }
  }

  // Extract plain text and calculate word count
  const contentText = extractPlainText(data.content);
  const wordCount = calculateWordCount(contentText);

  // Create guest comment (not approved by default)
  const comment = await prisma.comment.create({
    data: {
      postId: data.postId,
      userId: null,
      parentId: data.parentId,
      authorName: data.authorName,
      authorEmail: data.authorEmail,
      authorUrl: data.authorUrl || null,
      content: data.content,
      contentText,
      wordCount,
      isApproved: false, // Guest comments require approval
      ipAddress,
      userAgent,
      referrer,
    },
    include: {
      _count: {
        select: {
          replies: true,
          commentReactions: true,
        },
      },
    },
  });

  // Update parent comment reply count if this is a reply
  if (data.parentId) {
    await prisma.comment.update({
      where: { id: data.parentId },
      data: {
        replyCount: {
          increment: 1,
        },
      },
    });
  }

  return {
    success: true,
    message: 'Comment submitted and pending approval',
    data: { comment },
  };
}

/**
 * Get comments with pagination and filtering
 */
export async function getComments(
  query: CommentQueryParams,
  requestingUserId?: string
): Promise<ApiResponse<PaginatedResult<CommentListItem>>> {
  const {
    postId,
    userId,
    parentId,
    isApproved,
    isFeatured,
    page = 1,
    limit = 20,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // Ensure numbers
  const pageNum = typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum = typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 20;
  const skip = (pageNum - 1) * limitNum;

  // Get requesting user's role and check if they're post author
  let isPostAuthor = false;
  let isAdmin = false;

  if (requestingUserId) {
    const user = await prisma.user.findUnique({
      where: { id: requestingUserId },
      select: { role: true },
    });

    if (user) {
      isAdmin = user.role === 'ADMIN';
    }

    // Check if requesting user is the post author
    if (postId) {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      });

      if (post) {
        isPostAuthor = post.authorId === requestingUserId;
      }
    }
  }

  // Build where clause
  const where: any = {
    deletedAt: null,
  };

  if (postId) where.postId = postId;
  if (userId) where.userId = userId;
  if (parentId === 'root') {
    where.parentId = null;
  } else if (parentId) {
    where.parentId = parentId;
  }

  // Handle isApproved filter with special logic
  // Logic:
  // - Post author or admin: See ALL comments (approved and unapproved) only if isApproved is NOT specified
  // - Comment author: See approved comments + their own unapproved comments
  // - Unauthenticated/other users: See only approved comments
  if (typeof isApproved === 'boolean') {
    if (isApproved) {
      // If requesting approved comments
      if (isPostAuthor || isAdmin) {
        // Post author or admin: Remove the filter, show all comments
        // Don't add isApproved filter
      } else if (requestingUserId) {
        // Authenticated user: Show approved comments OR user's own comments
        where.OR = [
          { isApproved: true },
          { userId: requestingUserId },
        ];
      } else {
        // Unauthenticated: Only approved comments
        where.isApproved = true;
      }
    } else {
      // If requesting unapproved comments (isApproved=false)
      where.isApproved = false;
    }
  } else {
    // If isApproved is not specified (undefined)
    // Default behavior: show all for admin/author, approved only for others
    if (!isPostAuthor && !isAdmin) {
      if (requestingUserId) {
        // Authenticated user: Show approved comments OR user's own comments
        where.OR = [
          { isApproved: true },
          { userId: requestingUserId },
        ];
      } else {
        // Unauthenticated: Only approved comments
        where.isApproved = true;
      }
    }
    // Post author or admin: no filter, show all comments
  }

  if (typeof isFeatured === 'boolean') where.isFeatured = isFeatured;

  // Build orderBy
  const orderBy: any = {};
  if (sortBy === 'createdAt') {
    orderBy.createdAt = sortOrder;
  } else if (sortBy === 'helpfulCount') {
    orderBy.helpfulCount = sortOrder;
  } else if (sortBy === 'likeCount') {
    orderBy.likeCount = sortOrder;
  }

  // Fetch comments and total count
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            replies: true,
            commentReactions: true,
          },
        },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.comment.count({ where }),
  ]);

  const pagination = calculatePagination(total, pageNum, limitNum);

  return {
    success: true,
    message: 'Comments retrieved successfully',
    data: {
      data: comments,
      pagination,
    },
  };
}

/**
 * Get comment by ID with replies
 */
export async function getCommentById(
  id: string
): Promise<ApiResponse<{ comment: CommentResponse }>> {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
      replies: {
        where: { deletedAt: null, isApproved: true },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
          _count: {
            select: {
              replies: true,
              commentReactions: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        take: 10,
      },
      _count: {
        select: {
          replies: true,
          commentReactions: true,
        },
      },
    },
  });

  if (!comment || comment.deletedAt) {
    throw new AppError('Comment not found', 404);
  }

  return {
    success: true,
    message: 'Comment retrieved successfully',
    data: { comment },
  };
}

/**
 * Update comment (only author can update)
 */
export async function updateComment(
  id: string,
  data: UpdateCommentInput,
  userId: string
): Promise<ApiResponse<{ comment: CommentResponse }>> {
  // Find existing comment
  const existing = await prisma.comment.findUnique({
    where: { id },
    select: { userId: true, deletedAt: true },
  });

  if (!existing || existing.deletedAt) {
    throw new AppError('Comment not found', 404);
  }

  // Verify ownership (only comment author can edit)
  if (existing.userId !== userId) {
    throw new AppError('You can only edit your own comments', 403);
  }

  // Extract plain text and calculate word count
  const contentText = extractPlainText(data.content);
  const wordCount = calculateWordCount(contentText);

  // Update comment
  const comment = await prisma.comment.update({
    where: { id },
    data: {
      content: data.content,
      contentText,
      wordCount,
      isEdited: true,
      editedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          replies: true,
          commentReactions: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Comment updated successfully',
    data: { comment },
  };
}

/**
 * Moderate comment (approve/feature/pin)
 * Only post author or admin can moderate
 */
export async function moderateComment(
  id: string,
  data: ModerateCommentInput,
  userId: string
): Promise<ApiResponse<{ comment: CommentResponse }>> {
  // Find comment and verify post ownership
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      post: {
        select: { authorId: true },
      },
    },
  });

  if (!comment || comment.deletedAt) {
    throw new AppError('Comment not found', 404);
  }

  // Get user to check role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Only post author or admin can moderate comments
  const isPostAuthor = comment.post.authorId === userId;
  const isAdmin = user.role === 'ADMIN';

  if (!isPostAuthor && !isAdmin) {
    throw new AppError(
      'Only the post author or admin can moderate comments',
      403
    );
  }

  // Update comment moderation status
  const updated = await prisma.comment.update({
    where: { id },
    data: {
      ...data,
      moderatedBy: userId,
      moderatedAt: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          replies: true,
          commentReactions: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Comment moderation updated successfully',
    data: { comment: updated },
  };
}

/**
 * Delete comment (soft delete)
 * Author can delete own comment, post author can delete any comment on their post, admin can delete any comment
 */
export async function deleteComment(
  id: string,
  userId: string
): Promise<ApiResponse<null>> {
  // Find comment
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      post: {
        select: { authorId: true },
      },
    },
  });

  if (!comment || comment.deletedAt) {
    throw new AppError('Comment not found', 404);
  }

  // Get user to check role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check permissions: comment author OR post author OR admin
  const isCommentAuthor = comment.userId === userId;
  const isPostAuthor = comment.post.authorId === userId;
  const isAdmin = user.role === 'ADMIN';

  if (!isCommentAuthor && !isPostAuthor && !isAdmin) {
    throw new AppError(
      'You can only delete your own comments or comments on your posts',
      403
    );
  }

  // Soft delete comment
  await prisma.comment.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });

  // Decrement parent reply count if this is a reply
  if (comment.parentId) {
    await prisma.comment.update({
      where: { id: comment.parentId },
      data: {
        replyCount: {
          decrement: 1,
        },
      },
    });
  }

  return {
    success: true,
    message: 'Comment deleted successfully',
    data: null,
  };
}

import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type {
  CreateBookmarkRequest,
  UpdateBookmarkRequest,
  BookmarkResponse,
  BookmarkListItemResponse,
  BookmarkQueryParams,
} from '../types/index.js';
import type { ApiResponse, PaginatedResult } from '../types/response.types.js';
import {
  NotFoundError,
  ConflictError,
  calculatePagination,
} from '../utils/index.js';
import { logCreate, logUpdate, logDelete } from '../utils/activityLogger.js';

/**
 * Helper function to transform Bookmark to BookmarkResponse
 */
function toBookmarkResponse(bookmark: any): BookmarkResponse {
  return {
    id: bookmark.id,
    userId: bookmark.userId,
    postId: bookmark.postId,
    note: bookmark.note,
    tags: bookmark.tags,
    isFavorite: bookmark.isFavorite,
    isRead: bookmark.isRead,
    readAt: bookmark.readAt?.toISOString() || null,
    createdAt: bookmark.createdAt.toISOString(),
    updatedAt: bookmark.updatedAt.toISOString(),
    post: {
      id: bookmark.post.id,
      title: bookmark.post.title,
      slug: bookmark.post.slug,
      excerpt: bookmark.post.excerpt,
      featuredImageUrl: bookmark.post.featuredImageUrl,
      readingTime: bookmark.post.readingTime,
      author: {
        id: bookmark.post.author.id,
        name: bookmark.post.author.name,
        username: bookmark.post.author.username,
        avatarUrl: bookmark.post.author.avatarUrl,
      },
    },
  };
}

/**
 * Helper function to transform Bookmark to BookmarkListItemResponse
 */
function toBookmarkListItemResponse(bookmark: any): BookmarkListItemResponse {
  return {
    id: bookmark.id,
    postId: bookmark.postId,
    note: bookmark.note,
    tags: bookmark.tags,
    isFavorite: bookmark.isFavorite,
    isRead: bookmark.isRead,
    readAt: bookmark.readAt?.toISOString() || null,
    createdAt: bookmark.createdAt.toISOString(),
    updatedAt: bookmark.updatedAt.toISOString(),
    post: {
      id: bookmark.post.id,
      title: bookmark.post.title,
      slug: bookmark.post.slug,
      excerpt: bookmark.post.excerpt,
      featuredImageUrl: bookmark.post.featuredImageUrl,
      readingTime: bookmark.post.readingTime,
      author: {
        name: bookmark.post.author.name,
        username: bookmark.post.author.username,
        avatarUrl: bookmark.post.author.avatarUrl,
      },
    },
  };
}

/**
 * Create Bookmark
 */
export async function createBookmark(
  userId: string,
  data: CreateBookmarkRequest
): Promise<ApiResponse<BookmarkResponse>> {
  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id: data.postId },
  });

  if (!post) {
    throw new NotFoundError('Post not found');
  }

  // Check if bookmark already exists
  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: data.postId,
      },
    },
  });

  if (existingBookmark) {
    throw new ConflictError('You have already bookmarked this post');
  }

  // Create bookmark
  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      postId: data.postId,
      note: data.note,
      tags: data.tags || [],
      isFavorite: data.isFavorite || false,
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  // Log activity
  await logCreate(
    userId,
    'Bookmark',
    bookmark.id,
    `Bookmarked post: ${bookmark.post.title}`,
    {
      postId: bookmark.postId,
      postTitle: bookmark.post.title,
      isFavorite: bookmark.isFavorite,
      tags: bookmark.tags,
    }
  );

  return {
    success: true,
    message: 'Bookmark created successfully',
    data: toBookmarkResponse(bookmark),
  };
}

/**
 * Get Bookmark by ID
 */
export async function getBookmarkById(
  userId: string,
  bookmarkId: string
): Promise<ApiResponse<BookmarkResponse>> {
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId, // Ensure user owns this bookmark
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!bookmark) {
    throw new NotFoundError('Bookmark not found');
  }

  return {
    success: true,
    message: 'Bookmark retrieved successfully',
    data: toBookmarkResponse(bookmark),
  };
}

/**
 * Get Bookmark by Post ID
 * Check if user has bookmarked a specific post
 */
export async function getBookmarkByPostId(
  userId: string,
  postId: string
): Promise<ApiResponse<BookmarkResponse | null>> {
  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!bookmark) {
    return {
      success: true,
      message: 'Post not bookmarked',
      data: null,
    };
  }

  return {
    success: true,
    message: 'Bookmark retrieved successfully',
    data: toBookmarkResponse(bookmark),
  };
}

/**
 * Get All Bookmarks for User (with pagination and filters)
 */
export async function getAllBookmarks(
  userId: string,
  query: BookmarkQueryParams
): Promise<PaginatedResult<BookmarkListItemResponse>> {
  const {
    page = 1,
    limit = 10,
    isFavorite,
    isRead,
    tags,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // Ensure numbers
  const pageNum =
    typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum =
    typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: Prisma.BookmarkWhereInput = {
    userId, // Only user's bookmarks
  };

  // Filter by favorite
  if (isFavorite !== undefined) {
    where.isFavorite = isFavorite;
  }

  // Filter by read status
  if (isRead !== undefined) {
    where.isRead = isRead;
  }

  // Filter by tags
  if (tags) {
    const tagArray = tags.split(',').map((t) => t.trim());
    where.tags = {
      hasSome: tagArray,
    };
  }

  // Search in post title and bookmark note
  if (search) {
    where.OR = [
      {
        post: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      {
        note: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }

  // Build orderBy
  const orderBy: Prisma.BookmarkOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute queries
  const [bookmarks, total] = await Promise.all([
    prisma.bookmark.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      include: {
        post: {
          include: {
            author: {
              select: {
                name: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    }),
    prisma.bookmark.count({ where }),
  ]);

  const data = bookmarks.map(toBookmarkListItemResponse);
  const pagination = calculatePagination(total, pageNum, limitNum);

  return {
    data,
    pagination,
  };
}

/**
 * Update Bookmark
 */
export async function updateBookmark(
  userId: string,
  bookmarkId: string,
  data: UpdateBookmarkRequest
): Promise<ApiResponse<BookmarkResponse>> {
  // Check if bookmark exists and belongs to user
  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  });

  if (!existingBookmark) {
    throw new NotFoundError('Bookmark not found');
  }

  // Prepare update data
  const updateData: Prisma.BookmarkUpdateInput = {};

  if (data.note !== undefined) {
    updateData.note = data.note;
  }

  if (data.tags !== undefined) {
    updateData.tags = data.tags;
  }

  if (data.isFavorite !== undefined) {
    updateData.isFavorite = data.isFavorite;
  }

  if (data.isRead !== undefined) {
    updateData.isRead = data.isRead;
    // Set readAt timestamp when marking as read
    if (data.isRead && !existingBookmark.isRead) {
      updateData.readAt = new Date();
    }
    // Clear readAt when marking as unread
    if (!data.isRead && existingBookmark.isRead) {
      updateData.readAt = null;
    }
  }

  // Update bookmark
  const bookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: updateData,
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  // Log activity
  await logUpdate(
    userId,
    'Bookmark',
    bookmarkId,
    `Updated bookmark for post: ${bookmark.post.title}`,
    {
      note: existingBookmark.note,
      tags: existingBookmark.tags,
      isFavorite: existingBookmark.isFavorite,
      isRead: existingBookmark.isRead,
    },
    {
      note: bookmark.note,
      tags: bookmark.tags,
      isFavorite: bookmark.isFavorite,
      isRead: bookmark.isRead,
    }
  );

  return {
    success: true,
    message: 'Bookmark updated successfully',
    data: toBookmarkResponse(bookmark),
  };
}

/**
 * Delete Bookmark
 */
export async function deleteBookmark(
  userId: string,
  bookmarkId: string
): Promise<ApiResponse<null>> {
  // Check if bookmark exists and belongs to user
  const bookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
    include: {
      post: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!bookmark) {
    throw new NotFoundError('Bookmark not found');
  }

  await prisma.bookmark.delete({
    where: { id: bookmarkId },
  });

  // Log activity
  await logDelete(
    userId,
    'Bookmark',
    bookmarkId,
    `Deleted bookmark for post: ${bookmark.post.title}`,
    {
      postId: bookmark.postId,
      postTitle: bookmark.post.title,
      note: bookmark.note,
      tags: bookmark.tags,
    }
  );

  return {
    success: true,
    message: 'Bookmark deleted successfully',
    data: null,
  };
}

/**
 * Toggle Read Status
 */
export async function toggleReadStatus(
  userId: string,
  bookmarkId: string
): Promise<ApiResponse<BookmarkResponse>> {
  // Check if bookmark exists and belongs to user
  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  });

  if (!existingBookmark) {
    throw new NotFoundError('Bookmark not found');
  }

  const newIsRead = !existingBookmark.isRead;

  // Update bookmark
  const bookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: {
      isRead: newIsRead,
      readAt: newIsRead ? new Date() : null,
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  // Log activity
  await logUpdate(
    userId,
    'Bookmark',
    bookmarkId,
    `Marked bookmark as ${newIsRead ? 'read' : 'unread'}: ${bookmark.post.title}`,
    { isRead: existingBookmark.isRead },
    { isRead: newIsRead }
  );

  return {
    success: true,
    message: `Bookmark marked as ${newIsRead ? 'read' : 'unread'}`,
    data: toBookmarkResponse(bookmark),
  };
}

/**
 * Toggle Favorite
 */
export async function toggleFavorite(
  userId: string,
  bookmarkId: string
): Promise<ApiResponse<BookmarkResponse>> {
  // Check if bookmark exists and belongs to user
  const existingBookmark = await prisma.bookmark.findFirst({
    where: {
      id: bookmarkId,
      userId,
    },
  });

  if (!existingBookmark) {
    throw new NotFoundError('Bookmark not found');
  }

  const newIsFavorite = !existingBookmark.isFavorite;

  // Update bookmark
  const bookmark = await prisma.bookmark.update({
    where: { id: bookmarkId },
    data: {
      isFavorite: newIsFavorite,
    },
    include: {
      post: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  // Log activity
  await logUpdate(
    userId,
    'Bookmark',
    bookmarkId,
    `${newIsFavorite ? 'Added to' : 'Removed from'} favorites: ${bookmark.post.title}`,
    { isFavorite: existingBookmark.isFavorite },
    { isFavorite: newIsFavorite }
  );

  return {
    success: true,
    message: `Bookmark ${newIsFavorite ? 'added to' : 'removed from'} favorites`,
    data: toBookmarkResponse(bookmark),
  };
}

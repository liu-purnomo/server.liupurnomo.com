import { PostStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type {
  CreatePostRequest,
  PostDetailResponse,
  PostListItemResponse,
  PostQueryParams,
  PostResponse,
  UpdatePostRequest,
} from '../types/index.js';
import { ApiResponse, PaginatedResult } from '../types/response.types.js';
import {
  ConflictError,
  NotFoundError,
  calculatePagination,
} from '../utils/index.js';

/**
 * Post Service
 * Handles all post-related business logic
 */

// ==================== HELPER FUNCTIONS ====================

/**
 * Convert Prisma Post to PostResponse
 */
function toPostResponse(post: any): PostResponse {
  return {
    id: post.id,
    authorId: post.authorId,
    categoryId: post.categoryId,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImageUrl: post.featuredImageUrl,
    postType: post.postType,
    status: post.status,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    ogImageUrl: post.ogImageUrl,
    canonicalUrl: post.canonicalUrl,
    schemaMarkup: post.schemaMarkup,
    viewCount: post.viewCount,
    readingTime: post.readingTime,
    difficultyLevel: post.difficultyLevel,
    likeCount: post.likeCount || 0,
    helpfulCount: post.helpfulCount || 0,
    loveCount: post.loveCount || 0,
    insightfulCount: post.insightfulCount || 0,
    amazingCount: post.amazingCount || 0,
    publishedAt: post.publishedAt,
    scheduledAt: post.scheduledAt,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    deletedAt: post.deletedAt,
    author: post.author
      ? {
          id: post.author.id,
          name: post.author.name,
          username: post.author.username,
          avatarUrl: post.author.avatarUrl,
        }
      : undefined,
    category: post.category
      ? {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
        }
      : undefined,
    postTags: post.postTags
      ? post.postTags.map((pt: any) => ({
          tag: {
            id: pt.tag.id,
            name: pt.tag.name,
            slug: pt.tag.slug,
          },
        }))
      : undefined,
    postReactions: post.postReactions
      ? post.postReactions.map((reaction: any) => ({
          id: reaction.id,
          reactionType: reaction.reactionType,
          createdAt: reaction.createdAt,
          user: reaction.user
            ? {
                id: reaction.user.id,
                username: reaction.user.username,
                name: reaction.user.name,
                avatarUrl: reaction.user.avatarUrl,
              }
            : null,
        }))
      : undefined,
    _count: post._count,
  };
}

/**
 * Convert to PostListItemResponse
 */
function toPostListItem(post: any): PostListItemResponse {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImageUrl: post.featuredImageUrl,
    postType: post.postType,
    status: post.status,
    viewCount: post.viewCount,
    readingTime: post.readingTime,
    difficultyLevel: post.difficultyLevel,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: {
      id: post.author.id,
      name: post.author.name,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl,
    },
    category: {
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
    },
    postTags: post.postTags.map((pt: any) => ({
      tag: {
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      },
    })),
    _count: {
      comments: post._count?.comments || 0,
      bookmarks: post._count?.bookmarks || 0,
    },
  };
}

// ==================== CRUD OPERATIONS ====================

/**
 * Create Post
 * Creates a new post with optional image uploads
 */
export async function createPost(
  authorId: string,
  data: CreatePostRequest
): Promise<ApiResponse<PostResponse>> {
  // Check if slug already exists
  const existingPost = await prisma.post.findUnique({
    where: { slug: data.slug },
  });

  if (existingPost) {
    throw new ConflictError(`Post with slug '${data.slug}' already exists`);
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!category) {
    throw new NotFoundError(`Category with ID '${data.categoryId}' not found`);
  }

  // Handle tags - find or create
  let tagConnections:
    | Prisma.PostTagCreateNestedManyWithoutPostInput
    | undefined;
  if (data.tags && data.tags.length > 0) {
    // Find or create tags
    const tagOperations = data.tags.map(async (tagInput) => {
      // Try to find tag by slug or name
      const slug = tagInput
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');

      let tag = await prisma.tag.findUnique({
        where: { slug },
      });

      if (!tag) {
        // Create new tag
        tag = await prisma.tag.create({
          data: {
            name: tagInput.trim(),
            slug,
          },
        });
      }

      return tag.id;
    });

    const tagIds = await Promise.all(tagOperations);

    tagConnections = {
      create: tagIds.map((tagId) => ({
        tagId,
      })),
    };
  }

  // Auto-set publishedAt for published posts
  let publishedAt: Date | null = null;
  if (data.publishedAt) {
    publishedAt = new Date(data.publishedAt);
  } else if (data.status === PostStatus.PUBLISHED) {
    publishedAt = new Date();
  }

  // Handle scheduledAt
  let scheduledAt: Date | null = null;
  if (data.scheduledAt) {
    scheduledAt = new Date(data.scheduledAt);
  }

  // Create post
  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || null,
      content: data.content,
      authorId,
      categoryId: data.categoryId,
      featuredImageUrl: data.featuredImageUrl || null,
      postType: data.postType || 'BLOG',
      status: data.status || PostStatus.DRAFT,
      difficultyLevel: data.difficultyLevel || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      metaKeywords: data.metaKeywords || null,
      ogImageUrl: data.ogImageUrl || null,
      canonicalUrl: data.canonicalUrl || null,
      readingTime: data.readingTime || null,
      publishedAt,
      scheduledAt,
      postTags: tagConnections,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      postTags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
          postViews: true,
          bookmarks: true,
          inlineComments: true,
          paragraphReactions: true,
          highlights: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Post created successfully',
    data: toPostResponse(post),
  };
}

/**
 * Update Post
 * Updates an existing post
 */
export async function updatePost(
  postId: string,
  data: UpdatePostRequest
): Promise<ApiResponse<PostResponse>> {
  // Find existing post
  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      postTags: true,
    },
  });

  if (!existingPost) {
    throw new NotFoundError(`Post with ID '${postId}' not found`);
  }

  // Check slug uniqueness if updating slug
  if (data.slug && data.slug !== existingPost.slug) {
    const slugExists = await prisma.post.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists) {
      throw new ConflictError(`Post with slug '${data.slug}' already exists`);
    }
  }

  // Verify category if updating
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new NotFoundError(
        `Category with ID '${data.categoryId}' not found`
      );
    }
  }

  // Handle tags update
  let tagUpdates: any = {};
  if (data.tags !== undefined) {
    // Delete existing tag connections
    await prisma.postTag.deleteMany({
      where: { postId },
    });

    if (data.tags.length > 0) {
      // Find or create tags
      const tagOperations = data.tags.map(async (tagInput) => {
        const slug = tagInput
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');

        let tag = await prisma.tag.findUnique({
          where: { slug },
        });

        if (!tag) {
          tag = await prisma.tag.create({
            data: {
              name: tagInput.trim(),
              slug,
            },
          });
        }

        return tag.id;
      });

      const tagIds = await Promise.all(tagOperations);

      tagUpdates.postTags = {
        create: tagIds.map((tagId) => ({
          tagId,
        })),
      };
    }
  }

  // Handle publishedAt
  let publishedAt = existingPost.publishedAt;
  if (data.publishedAt !== undefined) {
    publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  } else if (
    data.status === PostStatus.PUBLISHED &&
    !existingPost.publishedAt
  ) {
    publishedAt = new Date();
  }

  // Handle scheduledAt
  let scheduledAt = existingPost.scheduledAt;
  if (data.scheduledAt !== undefined) {
    scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
  }

  // Update post
  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt !== undefined ? data.excerpt : undefined,
      content: data.content,
      categoryId: data.categoryId,
      featuredImageUrl:
        data.featuredImageUrl !== undefined ? data.featuredImageUrl : undefined,
      postType: data.postType,
      status: data.status,
      difficultyLevel:
        data.difficultyLevel !== undefined ? data.difficultyLevel : undefined,
      metaTitle: data.metaTitle !== undefined ? data.metaTitle : undefined,
      metaDescription:
        data.metaDescription !== undefined ? data.metaDescription : undefined,
      metaKeywords:
        data.metaKeywords !== undefined ? data.metaKeywords : undefined,
      ogImageUrl: data.ogImageUrl !== undefined ? data.ogImageUrl : undefined,
      canonicalUrl:
        data.canonicalUrl !== undefined ? data.canonicalUrl : undefined,
      readingTime: data.readingTime,
      publishedAt,
      scheduledAt,
      ...tagUpdates,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      postTags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: true,
          postViews: true,
          bookmarks: true,
          inlineComments: true,
          paragraphReactions: true,
          highlights: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Post updated successfully',
    data: toPostResponse(post),
  };
}

/**
 * Get Post by ID
 */
export async function getPostById(
  postId: string,
  includeUnpublished = false
): Promise<ApiResponse<PostResponse>> {
  const where: Prisma.PostWhereInput = {
    id: postId,
    deletedAt: null,
  };

  if (!includeUnpublished) {
    where.status = PostStatus.PUBLISHED;
  }

  const post = await prisma.post.findFirst({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      postTags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
      postReactions: {
        select: {
          id: true,
          reactionType: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, // Limit initial reactions
      },
      _count: {
        select: {
          comments: true,
          postViews: true,
          bookmarks: true,
          postReactions: true,
          inlineComments: true,
          paragraphReactions: true,
          highlights: true,
        },
      },
    },
  });

  if (!post) {
    throw new NotFoundError(`Post with ID '${postId}' not found`);
  }

  return {
    success: true,
    message: 'Post retrieved successfully',
    data: toPostResponse(post),
  };
}

/**
 * Get Post by Slug
 */
export async function getPostBySlug(
  slug: string,
  includeUnpublished = false
): Promise<ApiResponse<PostDetailResponse>> {
  const where: Prisma.PostWhereInput = {
    slug,
    deletedAt: null,
  };

  if (!includeUnpublished) {
    where.status = PostStatus.PUBLISHED;
  }

  const post = await prisma.post.findFirst({
    where,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          bio: true,
          location: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          iconUrl: true,
        },
      },
      postTags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            },
          },
        },
      },
      postSeriesItems: {
        include: {
          series: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              thumbnailUrl: true,
            },
          },
        },
        orderBy: {
          orderPosition: 'asc',
        },
      },
      comments: {
        where: {
          isApproved: true,
          deletedAt: null,
          parentId: null, // Only root comments
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
        orderBy: [
          { isPinned: 'desc' },
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 10, // Limit initial comments load
      },
      inlineComments: {
        where: {
          isPublic: true,
          isApproved: true,
          deletedAt: null,
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
              reactions: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      paragraphReactions: {
        where: {
          userId: { not: null }, // Only authenticated user reactions
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
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      highlights: {
        where: {
          isPublic: true,
          isHidden: false,
          deletedAt: null,
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
              notes: true,
              reactions: true,
              shares: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20, // Limit initial highlights
      },
      postReactions: {
        select: {
          id: true,
          reactionType: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50, // Limit initial reactions
      },
      _count: {
        select: {
          comments: {
            where: {
              isApproved: true,
              deletedAt: null,
            },
          },
          postViews: true,
          bookmarks: true,
          postReactions: true,
          inlineComments: {
            where: {
              isPublic: true,
              isApproved: true,
              deletedAt: null,
            },
          },
          paragraphReactions: true,
          highlights: {
            where: {
              isPublic: true,
              isHidden: false,
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  if (!post) {
    throw new NotFoundError(`Post with slug '${slug}' not found`);
  }

  // Fetch related posts (same category, exclude current post)
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      id: { not: post.id },
      status: PostStatus.PUBLISHED,
      deletedAt: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImageUrl: true,
      postType: true,
      status: true,
      viewCount: true,
      readingTime: true,
      difficultyLevel: true,
      publishedAt: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          bio: true,
          location: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          iconUrl: true,
        },
      },
      postTags: {
        include: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
            },
          },
        },
      },
      _count: {
        select: {
          comments: {
            where: {
              isApproved: true,
              deletedAt: null,
            },
          },
          bookmarks: true,
        },
      },
    },
    orderBy: [
      { viewCount: 'desc' }, // Prioritize popular posts
      { publishedAt: 'desc' },
    ],
    take: 5,
  });

  // Fetch latest posts for sidebar
  const latestPosts = await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
      deletedAt: null,
      id: { not: post.id }, // Exclude current post
    },
    select: {
      id: true,
      title: true,
      slug: true,
      featuredImageUrl: true,
      publishedAt: true,
      readingTime: true,
      viewCount: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          comments: {
            where: {
              isApproved: true,
              deletedAt: null,
            },
          },
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 5,
  });

  return {
    success: true,
    message: 'Post retrieved successfully',
    data: {
      post: toPostResponse(post),
      relatedPosts: relatedPosts.map(toPostListItem),
      latestPosts: latestPosts,
    },
  };
}

/**
 * Get All Posts with Pagination and Filtering
 */
export async function getAllPosts(
  query: PostQueryParams,
  includeUnpublished = false
): Promise<ApiResponse<PaginatedResult<PostListItemResponse>>> {
  const {
    page = 1,
    limit = 10,
    search,
    categoryId,
    categorySlug,
    tagId,
    tagSlug,
    authorId,
    authorUsername,
    status,
    postType,
    difficultyLevel,
    sortBy = 'publishedAt',
    sortOrder = 'desc',
  } = query;

  // Ensure numbers
  const pageNum =
    typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum =
    typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: Prisma.PostWhereInput = {
    deletedAt: null,
  };

  if (!includeUnpublished) {
    where.status = PostStatus.PUBLISHED;
  }

  if (status) {
    where.status = status;
  }

  if (postType) {
    where.postType = postType;
  }

  if (difficultyLevel) {
    where.difficultyLevel = difficultyLevel;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (tagId || tagSlug) {
    where.postTags = {
      some: tagId ? { tagId } : { tag: { slug: tagSlug } },
    };
  }

  if (authorId) {
    where.authorId = authorId;
  }

  if (authorUsername) {
    where.author = {
      username: authorUsername,
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Build order by
  const orderBy: Prisma.PostOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute queries in parallel
  const [posts, totalItems] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        postTags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
            bookmarks: true,
            postReactions: true,
          },
        },
      },
      skip,
      take: limitNum,
      orderBy,
    }),
    prisma.post.count({ where }),
  ]);

  const pagination = calculatePagination(totalItems, pageNum, limitNum);

  return {
    success: true,
    message: 'Posts retrieved successfully',
    data: {
      data: posts.map(toPostListItem),
      pagination,
    },
  };
}

/**
 * Delete Post (Soft Delete)
 */
export async function deletePost(postId: string): Promise<ApiResponse<null>> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundError(`Post with ID '${postId}' not found`);
  }

  // Soft delete
  await prisma.post.update({
    where: { id: postId },
    data: {
      deletedAt: new Date(),
    },
  });

  return {
    success: true,
    message: 'Post deleted successfully',
    data: null,
  };
}

/**
 * Permanently Delete Post
 */
export async function permanentlyDeletePost(
  postId: string
): Promise<ApiResponse<null>> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new NotFoundError(`Post with ID '${postId}' not found`);
  }

  // Permanently delete
  // Note: Image URLs are managed by the media library, not deleted here
  await prisma.post.delete({
    where: { id: postId },
  });

  return {
    success: true,
    message: 'Post permanently deleted',
    data: null,
  };
}

/**
 * Increment View Count
 */
export async function incrementViewCount(postId: string): Promise<void> {
  await prisma.post.update({
    where: { id: postId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  });
}

// ==================== AUTOCOMPLETE/SEARCH OPERATIONS ====================

/**
 * Search Posts for Internal Link/Autocomplete
 * Returns limited post info for link suggestions
 */
export async function searchPostsForLink(
  searchQuery: string,
  limit: number = 10
): Promise<
  Array<{ id: string; title: string; slug: string; url: string; type: string }>
> {
  // Build search condition
  const where: any = {
    status: PostStatus.PUBLISHED,
    deletedAt: null,
  };

  // Add search filter if query provided
  if (searchQuery) {
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { slug: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  // Search posts
  const posts = await prisma.post.findMany({
    where,
    select: {
      id: true,
      title: true,
      slug: true,
      postType: true,
    },
    take: limit,
    orderBy: {
      publishedAt: 'desc',
    },
  });

  // Transform to expected format
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    url: `/${post.slug}`,
    type: post.postType.toLowerCase(),
  }));
}

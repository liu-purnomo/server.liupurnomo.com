import {
  PostType,
  PostStatus,
  DifficultyLevel,
  ReactionType,
} from '@prisma/client';

/**
 * Post Type Definitions
 * Based on Prisma schema Post model
 */

// ==================== REQUEST TYPES ====================

/**
 * Create Post Request
 * Data required to create a new post
 */
export interface CreatePostRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: any; // JSON content blocks
  featuredImageUrl?: string; // URL to featured image
  categoryId: string;
  tags?: string[]; // Array of tag slugs or names
  postType?: PostType;
  status?: PostStatus;
  difficultyLevel?: DifficultyLevel; // Required for tutorials

  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string; // URL to OG image for social sharing
  canonicalUrl?: string;

  // Scheduling
  publishedAt?: string; // ISO date string for scheduled posts
  scheduledAt?: string; // ISO date string
  readingTime?: number; // In minutes
}

/**
 * Update Post Request
 * Partial update of post fields
 */
export interface UpdatePostRequest {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: any;
  featuredImageUrl?: string;
  categoryId?: string;
  tags?: string[];
  postType?: PostType;
  status?: PostStatus;
  difficultyLevel?: DifficultyLevel;

  // SEO fields
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;

  // Scheduling
  publishedAt?: string;
  scheduledAt?: string;
  readingTime?: number;
}

// ==================== RESPONSE TYPES ====================

/**
 * Post Response
 * Full post data with relations
 */
export interface PostResponse {
  id: string;
  authorId: string;
  categoryId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: any;
  featuredImageUrl: string | null;
  postType: PostType;
  status: PostStatus;

  // SEO fields
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  schemaMarkup: any | null;

  // Metrics
  viewCount: number;
  readingTime: number | null;
  difficultyLevel: DifficultyLevel | null;

  // Reaction counts
  likeCount: number;
  helpfulCount: number;
  loveCount: number;
  insightfulCount: number;
  amazingCount: number;

  // Timestamps
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations (optional)
  author?: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  postTags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  postReactions?: Array<{
    id: string;
    reactionType: ReactionType;
    createdAt: Date;
    user: {
      id: string;
      username: string;
      name: string | null;
      avatarUrl: string | null;
    } | null;
  }>;
  _count?: {
    comments?: number;
    postViews?: number;
    bookmarks?: number;
    postReactions?: number;
    inlineComments?: number;
    paragraphReactions?: number;
    highlights?: number;
  };
}

/**
 * Post List Item Response
 * Lightweight post data for listings
 */
export interface PostListItemResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImageUrl: string | null;
  postType: PostType;
  status: PostStatus;
  viewCount: number;
  readingTime: number | null;
  difficultyLevel: DifficultyLevel | null;
  publishedAt: Date | null;
  createdAt: Date;

  author: {
    id: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  postTags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  _count: {
    comments: number;
    bookmarks: number;
  };
}

/**
 * Post Detail Response with Related Posts
 * Extended post response with related and latest posts
 */
export interface PostDetailResponse {
  post: PostResponse;
  relatedPosts: PostListItemResponse[];
  latestPosts: Array<{
    id: string;
    title: string;
    slug: string;
    featuredImageUrl: string | null;
    publishedAt: Date | null;
    readingTime: number | null;
    viewCount: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    _count: {
      comments: number;
    };
  }>;
}

/**
 * Query parameters for post listing
 */
export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  tagId?: string;
  tagSlug?: string;
  authorId?: string;
  authorUsername?: string;
  status?: PostStatus;
  postType?: PostType;
  difficultyLevel?: DifficultyLevel;
  sortBy?: 'publishedAt' | 'createdAt' | 'updatedAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// ==================== POST REACTION TYPES ====================

/**
 * Post Reaction Request
 * Add or remove reaction from a post
 */
export interface PostReactionRequest {
  reactionType: ReactionType; // LIKE, HELPFUL, LOVE, INSIGHTFUL, AMAZING
}

/**
 * Post Reaction Response
 * Individual reaction record
 */
export interface PostReactionResponse {
  id: string;
  postId: string;
  userId: string | null;
  reactionType: ReactionType;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
}

/**
 * Post Reactions Summary
 * Aggregate reaction counts for a post
 */
export interface PostReactionsSummary {
  postId: string;
  totalReactions: number;
  likeCount: number;
  helpfulCount: number;
  loveCount: number;
  insightfulCount: number;
  amazingCount: number;
  userReactions?: ReactionType[]; // Reactions from current user
}

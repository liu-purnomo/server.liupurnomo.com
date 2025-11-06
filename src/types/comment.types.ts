/**
 * Comment Types
 * Based on Prisma Comment model
 */

// ReactionType is used in Prisma schema

/**
 * Base comment response structure
 * Matches Prisma Comment model + relations
 */
export interface CommentResponse {
  id: string;
  postId: string;
  userId: string | null;
  parentId: string | null;

  // Guest commenter information
  authorName: string | null;
  authorEmail: string | null;
  authorUrl: string | null;

  // Content (EditorJS format JSON)
  content: any; // JSON type
  contentText: string;

  // Content metrics
  wordCount: number;

  // Comment status flags
  isFeatured: boolean;
  isApproved: boolean;
  isPinned: boolean;
  isAuthorReply: boolean;

  // Engagement metrics
  helpfulCount: number;
  likeCount: number;
  replyCount: number;

  // Moderation
  spamScore: number;
  isEdited: boolean;
  editedAt: Date | null;
  moderatedBy: string | null;
  moderatedAt: Date | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  user?: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
  parent?: CommentResponse | null;
  replies?: CommentResponse[];
  _count?: {
    replies: number;
    commentReactions: number;
  };
}

/**
 * Comment list item for listings
 * Lighter version without deep nesting
 */
export interface CommentListItem {
  id: string;
  postId: string;
  userId: string | null;
  parentId: string | null;
  authorName: string | null;
  content: any;
  contentText: string;
  wordCount: number;
  isFeatured: boolean;
  isApproved: boolean;
  isPinned: boolean;
  isAuthorReply: boolean;
  helpfulCount: number;
  likeCount: number;
  replyCount: number;
  isEdited: boolean;
  editedAt: Date | null;
  createdAt: Date;
  user?: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
  _count?: {
    replies: number;
    commentReactions: number;
  };
}

/**
 * Create comment input (authenticated user)
 */
export interface CreateCommentInput {
  postId: string;
  parentId?: string; // For replies
  content: any; // EditorJS JSON blocks
}

/**
 * Create guest comment input
 */
export interface CreateGuestCommentInput {
  postId: string;
  parentId?: string;
  authorName: string;
  authorEmail: string;
  authorUrl?: string;
  content: any; // EditorJS JSON blocks
}

/**
 * Update comment input
 */
export interface UpdateCommentInput {
  content: any; // EditorJS JSON blocks
}

/**
 * Query params for listing comments
 */
export interface CommentQueryParams {
  postId?: string;
  userId?: string;
  parentId?: string | 'root'; // 'root' for top-level comments only
  isApproved?: boolean;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'helpfulCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Moderate comment input (for post author/admin)
 */
export interface ModerateCommentInput {
  isApproved?: boolean;
  isFeatured?: boolean;
  isPinned?: boolean;
}

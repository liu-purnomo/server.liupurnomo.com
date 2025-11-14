/**
 * Bookmark Types and Interfaces
 */

// ==================== REQUEST TYPES ====================

/**
 * Create Bookmark Request
 */
export interface CreateBookmarkRequest {
  postId: string;
  note?: string;
  tags?: string[];
  isFavorite?: boolean;
}

/**
 * Update Bookmark Request
 */
export interface UpdateBookmarkRequest {
  note?: string;
  tags?: string[];
  isFavorite?: boolean;
  isRead?: boolean;
}

/**
 * Bookmark Query Parameters
 */
export interface BookmarkQueryParams {
  page?: number;
  limit?: number;
  isFavorite?: boolean;
  isRead?: boolean;
  tags?: string;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'readAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE TYPES ====================

/**
 * Bookmark Response (Full details with post info)
 */
export interface BookmarkResponse {
  id: string;
  userId: string;
  postId: string;
  note: string | null;
  tags: string[];
  isFavorite: boolean;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Post information
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImageUrl: string | null;
    readingTime: number | null;
    author: {
      id: string;
      name: string | null;
      username: string;
      avatarUrl: string | null;
    };
  };
}

/**
 * Bookmark List Item Response (Simplified for lists)
 */
export interface BookmarkListItemResponse {
  id: string;
  postId: string;
  note: string | null;
  tags: string[];
  isFavorite: boolean;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Post information
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImageUrl: string | null;
    readingTime: number | null;
    author: {
      name: string | null;
      username: string;
      avatarUrl: string | null;
    };
  };
}

/**
 * Category Types
 * Type definitions for category management
 */

// ==================== REQUEST TYPES ====================

/**
 * Create Category Request
 * For creating a new category
 */
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  orderPosition?: number;
}

/**
 * Update Category Request
 * For updating an existing category
 */
export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string;
  metaTitle?: string;
  metaDescription?: string;
  orderPosition?: number;
}

/**
 * Get Categories Query Parameters
 */
export interface GetCategoriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string; // Filter by parent (null for root categories)
  sortBy?: 'name' | 'orderPosition' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE TYPES ====================

/**
 * Category Response
 * Full category information
 */
export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  iconUrl: string | null;
  orderPosition: number;
  createdAt: Date;
  updatedAt: Date;
  parent?: CategoryResponse | null;
  children?: CategoryResponse[];
  _count?: {
    posts: number;
    children: number;
  };
}

/**
 * Category List Item Response
 * For category lists
 */
export interface CategoryListItemResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  iconUrl: string | null;
  orderPosition: number;
  createdAt: Date;
  _count: {
    posts: number;
    children: number;
  };
}

/**
 * Category Tree Response
 * For hierarchical category display
 */
export interface CategoryTreeResponse {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  orderPosition: number;
  children: CategoryTreeResponse[];
  _count: {
    posts: number;
  };
}

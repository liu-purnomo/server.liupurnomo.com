/**
 * Category Schemas
 * OpenAPI schema definitions for category management
 */

export const categorySchemas = {
  // ==================== REQUEST SCHEMAS ====================

  CreateCategoryRequest: {
    type: 'object',
    required: ['name', 'slug'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        example: 'Web Development',
        description: 'Category name',
      },
      slug: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'web-development',
        description: 'URL-friendly slug (lowercase letters, numbers, and hyphens only)',
      },
      description: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Everything related to web development',
      },
      parentId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
        description: 'Parent category ID for hierarchical structure',
      },
      metaTitle: {
        type: 'string',
        maxLength: 60,
        nullable: true,
        example: 'Web Development Articles and Tutorials',
      },
      metaDescription: {
        type: 'string',
        maxLength: 160,
        nullable: true,
        example: 'Explore our collection of web development articles, tutorials, and resources',
      },
      orderPosition: {
        type: 'integer',
        minimum: 0,
        default: 0,
        example: 0,
        description: 'Sort order position',
      },
      icon: {
        type: 'string',
        format: 'binary',
        description: 'Category icon image (max 5MB, JPEG/PNG/WebP/HEIC)',
      },
    },
  },

  UpdateCategoryRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        example: 'Web Development',
      },
      slug: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'web-development',
      },
      description: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Everything related to web development',
      },
      parentId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
      },
      metaTitle: {
        type: 'string',
        maxLength: 60,
        nullable: true,
        example: 'Web Development Articles and Tutorials',
      },
      metaDescription: {
        type: 'string',
        maxLength: 160,
        nullable: true,
        example: 'Explore our collection of web development articles, tutorials, and resources',
      },
      orderPosition: {
        type: 'integer',
        minimum: 0,
        example: 0,
      },
      icon: {
        type: 'string',
        format: 'binary',
        description: 'Category icon image (max 5MB, JPEG/PNG/WebP/HEIC)',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  CategoryResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      name: {
        type: 'string',
        example: 'Web Development',
      },
      slug: {
        type: 'string',
        example: 'web-development',
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'Everything related to web development',
      },
      parentId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
      },
      iconUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/storages/category-icons/icon-medium.webp',
      },
      metaTitle: {
        type: 'string',
        nullable: true,
        example: 'Web Development Articles and Tutorials',
      },
      metaDescription: {
        type: 'string',
        nullable: true,
        example: 'Explore our collection of web development articles, tutorials, and resources',
      },
      orderPosition: {
        type: 'integer',
        example: 0,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      parent: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          slug: { type: 'string' },
        },
      },
      children: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
          },
        },
      },
      _count: {
        type: 'object',
        properties: {
          posts: {
            type: 'integer',
            example: 15,
            description: 'Number of posts in this category',
          },
          children: {
            type: 'integer',
            example: 3,
            description: 'Number of child categories',
          },
        },
      },
    },
  },

  CategoryListItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      name: {
        type: 'string',
        example: 'Web Development',
      },
      slug: {
        type: 'string',
        example: 'web-development',
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'Everything related to web development',
      },
      iconUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/storages/category-icons/icon-medium.webp',
      },
      orderPosition: {
        type: 'integer',
        example: 0,
      },
      _count: {
        type: 'object',
        properties: {
          posts: {
            type: 'integer',
            example: 15,
          },
          children: {
            type: 'integer',
            example: 3,
          },
        },
      },
    },
  },

  CategoryTreeResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      name: {
        type: 'string',
        example: 'Web Development',
      },
      slug: {
        type: 'string',
        example: 'web-development',
      },
      iconUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/storages/category-icons/icon-medium.webp',
      },
      orderPosition: {
        type: 'integer',
        example: 0,
      },
      children: {
        type: 'array',
        items: { $ref: '#/components/schemas/CategoryTreeResponse' },
        description: 'Nested child categories',
      },
    },
  },
};

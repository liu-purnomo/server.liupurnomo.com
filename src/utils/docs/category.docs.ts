/**
 * Category Management API Documentation
 * OpenAPI paths for category management endpoints
 */

export const categoryPaths = {
  // ==================== PUBLIC ENDPOINTS ====================

  '/api/categories/tree': {
    get: {
      tags: ['Categories'],
      summary: 'Get category tree',
      description: 'Get hierarchical category structure. No authentication required.',
      security: [],
      responses: {
        200: {
          description: 'Category tree retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Category tree retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      categories: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/CategoryTreeResponse' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/categories/slug/{slug}': {
    get: {
      tags: ['Categories'],
      summary: 'Get category by slug',
      description: 'Get category information by slug. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Category slug (e.g., web-development)',
          example: 'web-development',
        },
      ],
      responses: {
        200: {
          description: 'Category retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Category retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      category: { $ref: '#/components/schemas/CategoryResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/categories/{id}': {
    get: {
      tags: ['Categories'],
      summary: 'Get category by ID',
      description: 'Get category information by ID. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Category ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Category retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Category retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      category: { $ref: '#/components/schemas/CategoryResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },

    // ==================== ADMIN/AUTHOR ENDPOINTS ====================

    patch: {
      tags: ['Categories'],
      summary: 'Update category (Admin/Author only)',
      description: 'Update category information. Requires ADMIN or AUTHOR role. Supports multipart/form-data for icon upload.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Category ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: { $ref: '#/components/schemas/UpdateCategoryRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Category updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Category updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      category: { $ref: '#/components/schemas/CategoryResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },

    delete: {
      tags: ['Categories'],
      summary: 'Delete category (Admin/Author only)',
      description: 'Delete a category. Requires ADMIN or AUTHOR role. Cannot delete if category has children or posts.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Category ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        204: {
          description: 'Category deleted successfully',
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: {
          description: 'Cannot delete category with children or posts',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Cannot delete category with existing child categories or posts',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/categories': {
    get: {
      tags: ['Categories'],
      summary: 'Get all categories (Paginated)',
      description: 'Get paginated list of categories with filtering options. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Items per page',
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by category name',
        },
        {
          name: 'parentId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by parent category ID (use "null" for root categories)',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['name', 'orderPosition', 'createdAt'], default: 'orderPosition' },
          description: 'Sort field',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
          description: 'Sort order',
        },
      ],
      responses: {
        200: {
          description: 'Categories retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Categories retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      categories: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/CategoryListItemResponse' },
                      },
                    },
                  },
                  pagination: { $ref: '#/components/schemas/PaginationMeta' },
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ['Categories'],
      summary: 'Create category (Admin/Author only)',
      description: 'Create a new category. Requires ADMIN or AUTHOR role. Supports multipart/form-data for icon upload.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: { $ref: '#/components/schemas/CreateCategoryRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Category created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Category created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      category: { $ref: '#/components/schemas/CategoryResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/categories/{id}/icon': {
    delete: {
      tags: ['Categories'],
      summary: 'Delete category icon (Admin/Author only)',
      description: 'Delete the icon for a category. Requires ADMIN or AUTHOR role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Category ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Category icon deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Category icon deleted successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      category: { $ref: '#/components/schemas/CategoryResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};

/**
 * Tag Management API Documentation
 * OpenAPI paths for tag management endpoints
 */

export const tagPaths = {
  // ==================== PUBLIC ENDPOINTS ====================

  '/api/tags/slug/{slug}': {
    get: {
      tags: ['Tags'],
      summary: 'Get tag by slug',
      description: 'Get tag information by slug. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Tag slug (e.g., javascript)',
          example: 'javascript',
        },
      ],
      responses: {
        200: {
          description: 'Tag retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Tag retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      tag: { $ref: '#/components/schemas/TagResponse' },
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

  '/api/tags/{id}': {
    get: {
      tags: ['Tags'],
      summary: 'Get tag by ID',
      description: 'Get tag information by ID. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Tag ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Tag retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Tag retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      tag: { $ref: '#/components/schemas/TagResponse' },
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
      tags: ['Tags'],
      summary: 'Update tag (Admin/Author only)',
      description: 'Update tag information. Requires ADMIN or AUTHOR role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Tag ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateTagRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Tag updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Tag updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      tag: { $ref: '#/components/schemas/TagResponse' },
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
      tags: ['Tags'],
      summary: 'Delete tag (Admin/Author only)',
      description: 'Delete a tag. Requires ADMIN or AUTHOR role. Cannot delete if tag is assigned to posts.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Tag ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        204: {
          description: 'Tag deleted successfully',
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: {
          description: 'Cannot delete tag assigned to posts',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Cannot delete tag that is assigned to posts',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/tags': {
    get: {
      tags: ['Tags'],
      summary: 'Get all tags (Paginated)',
      description: 'Get paginated list of tags with filtering options. No authentication required.',
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
          description: 'Search by tag name',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['name', 'createdAt'], default: 'name' },
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
          description: 'Tags retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Tags retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      tags: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/TagListItemResponse' },
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
      tags: ['Tags'],
      summary: 'Create tag (Admin/Author only)',
      description: 'Create a new tag. Requires ADMIN or AUTHOR role.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTagRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Tag created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Tag created successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      tag: { $ref: '#/components/schemas/TagResponse' },
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
};

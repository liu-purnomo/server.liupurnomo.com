/**
 * Media Library API Documentation
 * OpenAPI paths for WordPress-like media management endpoints
 */

export const mediaPaths = {
  // ==================== PUBLIC ENDPOINTS ====================

  '/api/media/{id}': {
    get: {
      tags: ['Media'],
      summary: 'Get media by ID',
      description: 'Get media information by ID with all image sizes. No authentication required.',
      security: [],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Media ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Media retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Media retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      media: { $ref: '#/components/schemas/MediaResponse' },
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

    // ==================== AUTHOR/ADMIN ENDPOINTS ====================

    patch: {
      tags: ['Media'],
      summary: 'Update media metadata (Owner/Admin only)',
      description: 'Update media altText and caption. Requires ADMIN or AUTHOR role. Only owner or ADMIN can update.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Media ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateMediaRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Media updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Media updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      media: { $ref: '#/components/schemas/MediaResponse' },
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
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },

    delete: {
      tags: ['Media'],
      summary: 'Delete media (Owner/Admin only)',
      description: 'Delete media file and database record. Requires ADMIN or AUTHOR role. Only owner or ADMIN can delete.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Media ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Media deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Media deleted successfully' },
                  data: { type: 'null' },
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

  '/api/media': {
    get: {
      tags: ['Media'],
      summary: 'Get all media (Paginated)',
      description: 'Get paginated list of media with filtering options. No authentication required.',
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
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Items per page',
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search by fileName, altText, or caption',
        },
        {
          name: 'mimeType',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by exact MIME type',
          example: 'image/jpeg',
        },
        {
          name: 'mimeTypePrefix',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by MIME type prefix',
          example: 'image',
        },
        {
          name: 'userId',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by uploader user ID',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['createdAt', 'fileName', 'fileSize'], default: 'createdAt' },
          description: 'Sort field',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort order',
        },
      ],
      responses: {
        200: {
          description: 'Media retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Media retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/MediaListItemResponse' },
                      },
                      pagination: { $ref: '#/components/schemas/PaginationMeta' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ['Media'],
      summary: 'Upload media (Author/Admin only)',
      description: 'Upload a new media file (image, video, or document). Requires ADMIN or AUTHOR role. Supports images (20MB), videos (100MB), and documents (10MB).',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              required: ['file'],
              properties: {
                file: {
                  type: 'string',
                  format: 'binary',
                  description: 'Media file to upload (images: JPEG/PNG/WebP/HEIC/GIF/SVG, videos: MP4/WebM/MOV, documents: PDF/Word/Excel)',
                },
                altText: {
                  type: 'string',
                  maxLength: 255,
                  description: 'Alternative text for accessibility',
                  example: 'A beautiful sunset over the ocean',
                },
                caption: {
                  type: 'string',
                  maxLength: 1000,
                  description: 'Media caption',
                  example: 'Sunset at Bali beach, 2024',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Media uploaded successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Media uploaded successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      media: { $ref: '#/components/schemas/MediaResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad Request - Invalid file type or size',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Image file size exceeds maximum allowed size of 20MB',
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
};

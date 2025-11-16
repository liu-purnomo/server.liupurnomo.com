/**
 * Cache Management API Documentation
 * OpenAPI paths for cache management endpoints (Admin only)
 */

export const cachePaths = {
  // ==================== ADMIN ONLY ENDPOINTS ====================

  '/api/cache/clear': {
    delete: {
      tags: ['Cache Management'],
      summary: 'Clear all cache',
      description:
        'Clear all cached data to force fresh data from database. This endpoint is restricted to ADMIN role only. Use this when you need to see updated data immediately.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Cache cleared successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClearCacheResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: {
          description: 'Forbidden - Admin role required',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Access denied. Required role(s): ADMIN',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Failed to clear cache',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Failed to clear cache. Redis might not be available.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  '/api/cache/stats': {
    get: {
      tags: ['Cache Management'],
      summary: 'Get cache statistics',
      description:
        'Get cache statistics and status. This endpoint is restricted to ADMIN role only.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Cache stats retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CacheStatsResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: {
          description: 'Forbidden - Admin role required',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  message: {
                    type: 'string',
                    example: 'Access denied. Required role(s): ADMIN',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

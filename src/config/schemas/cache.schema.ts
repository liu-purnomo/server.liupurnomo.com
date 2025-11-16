/**
 * Cache Schemas
 * OpenAPI schema definitions for cache management endpoints
 */

export const cacheSchemas = {
  /**
   * Clear Cache Response
   */
  ClearCacheResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'All cache cleared successfully. Fresh data will be loaded from database.',
      },
      data: {
        type: 'object',
        properties: {
          cleared: {
            type: 'boolean',
            example: true,
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-16T10:30:00.000Z',
          },
        },
      },
    },
    required: ['success', 'message', 'data'],
  },

  /**
   * Cache Stats Response
   */
  CacheStatsResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
      },
      message: {
        type: 'string',
        example: 'Cache stats retrieved successfully',
      },
      data: {
        type: 'object',
        properties: {
          connected: {
            type: 'boolean',
            example: true,
          },
          memory: {
            type: 'string',
            example: '2.45M',
            description: 'Redis memory usage in human-readable format',
          },
          totalKeys: {
            type: 'number',
            example: 42,
            description: 'Total number of keys in Redis',
          },
          keysByPrefix: {
            type: 'object',
            description: 'Number of keys grouped by cache prefix',
            example: {
              sitemap: 1,
              post: 5,
              'post:list': 3,
              category: 8,
              'category:list': 2,
              tag: 12,
              'tag:list': 4,
              user: 3,
              'user:stats': 2,
              event: 0,
              'event:list': 0,
              media: 2,
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-16T10:30:00.000Z',
          },
        },
      },
    },
    required: ['success', 'message', 'data'],
  },
};

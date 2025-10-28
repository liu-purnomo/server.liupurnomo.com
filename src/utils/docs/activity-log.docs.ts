/**
 * Activity Log Management API Documentation
 * OpenAPI paths for activity log management endpoints
 * All endpoints require ADMIN role
 */

export const activityLogPaths = {
  // ==================== ADMIN-ONLY ENDPOINTS ====================

  '/api/activity-logs/stats': {
    get: {
      tags: ['Activity Logs'],
      summary: 'Get activity log statistics (Admin only)',
      description: 'Get statistical data about activity logs. Requires ADMIN role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'userId',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by user ID',
          example: 'clxyz123abc456def',
        },
        {
          name: 'startDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date-time' },
          description: 'Filter from date (ISO 8601)',
          example: '2025-01-01T00:00:00.000Z',
        },
        {
          name: 'endDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date-time' },
          description: 'Filter to date (ISO 8601)',
          example: '2025-01-31T23:59:59.999Z',
        },
        {
          name: 'entity',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by entity type',
          example: 'User',
        },
      ],
      responses: {
        200: {
          description: 'Activity log stats retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Activity log stats retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      stats: { $ref: '#/components/schemas/ActivityLogStatsResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },

  '/api/activity-logs/bulk-delete': {
    post: {
      tags: ['Activity Logs'],
      summary: 'Bulk delete activity logs (Admin only)',
      description: 'Delete multiple activity logs based on filters. Requires ADMIN role. Use with caution for cleanup operations.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BulkDeleteActivityLogsRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Activity logs deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Successfully deleted 150 activity logs' },
                  data: {
                    type: 'object',
                    properties: {
                      deletedCount: { type: 'integer', example: 150 },
                    },
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

  '/api/activity-logs': {
    get: {
      tags: ['Activity Logs'],
      summary: 'Get all activity logs (Admin only)',
      description: 'Get paginated list of activity logs with optional filters. Requires ADMIN role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number',
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Items per page',
        },
        {
          name: 'userId',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by user ID',
          example: 'clxyz123abc456def',
        },
        {
          name: 'action',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER', 'RESET_PASSWORD', 'VERIFY_EMAIL'],
          },
          description: 'Filter by action type',
        },
        {
          name: 'entity',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by entity type',
          example: 'User',
        },
        {
          name: 'entityId',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Filter by specific entity ID',
          example: 'clxyz123abc456def',
        },
        {
          name: 'success',
          in: 'query',
          required: false,
          schema: { type: 'string', enum: ['true', 'false'] },
          description: 'Filter by success/failure',
        },
        {
          name: 'severity',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
          },
          description: 'Filter by severity level',
        },
        {
          name: 'method',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          },
          description: 'Filter by HTTP method',
        },
        {
          name: 'startDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date-time' },
          description: 'Filter from date (ISO 8601)',
          example: '2025-01-01T00:00:00.000Z',
        },
        {
          name: 'endDate',
          in: 'query',
          required: false,
          schema: { type: 'string', format: 'date-time' },
          description: 'Filter to date (ISO 8601)',
          example: '2025-01-31T23:59:59.999Z',
        },
        {
          name: 'search',
          in: 'query',
          required: false,
          schema: { type: 'string' },
          description: 'Search in description',
        },
        {
          name: 'sortBy',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['createdAt', 'action', 'entity', 'severity', 'duration', 'userId'],
            default: 'createdAt',
          },
          description: 'Sort field',
        },
        {
          name: 'sortOrder',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['asc', 'desc'],
            default: 'desc',
          },
          description: 'Sort order',
        },
      ],
      responses: {
        200: {
          description: 'Activity logs retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Activity logs retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      activityLogs: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ActivityLogListItemResponse' },
                      },
                    },
                  },
                  pagination: { $ref: '#/components/schemas/PaginationMeta' },
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

  '/api/activity-logs/{id}': {
    get: {
      tags: ['Activity Logs'],
      summary: 'Get activity log by ID (Admin only)',
      description: 'Get detailed activity log information by ID. Requires ADMIN role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Activity log ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        200: {
          description: 'Activity log retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Activity log retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      activityLog: { $ref: '#/components/schemas/ActivityLogResponse' },
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

    patch: {
      tags: ['Activity Logs'],
      summary: 'Update activity log (Admin only)',
      description: 'Update activity log metadata like severity or add notes. Requires ADMIN role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Activity log ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateActivityLogRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Activity log updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Activity log updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      activityLog: { $ref: '#/components/schemas/ActivityLogResponse' },
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
      tags: ['Activity Logs'],
      summary: 'Delete activity log (Admin only)',
      description: 'Delete an activity log by ID. Requires ADMIN role.',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Activity log ID (CUID)',
          example: 'clxyz123abc456def',
        },
      ],
      responses: {
        204: {
          description: 'Activity log deleted successfully',
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};

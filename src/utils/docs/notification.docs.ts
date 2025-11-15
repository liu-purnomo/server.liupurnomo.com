/**
 * Notification API Documentation
 * OpenAPI paths for notification endpoints
 */

export const notificationPaths = {
  '/api/notifications': {
    get: {
      tags: ['Notifications'],
      summary: 'Get user notifications',
      description: `Get paginated list of user's notifications with optional filters.

Supports filtering by:
- Read/unread status
- Notification type
- Sorting by creation or update date`,
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number',
          example: 1,
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          description: 'Items per page',
          example: 20,
        },
        {
          name: 'isRead',
          in: 'query',
          schema: { type: 'boolean' },
          description: 'Filter by read/unread status',
          example: false,
        },
        {
          name: 'type',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by notification type',
          example: 'COMMENT_ON_POST',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: { type: 'string', enum: ['createdAt', 'updatedAt'], default: 'createdAt' },
          description: 'Sort field',
          example: 'createdAt',
        },
        {
          name: 'sortOrder',
          in: 'query',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort order',
          example: 'desc',
        },
      ],
      responses: {
        200: {
          description: 'Notifications retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotificationListResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/notifications/unread-count': {
    get: {
      tags: ['Notifications'],
      summary: 'Get unread notifications count',
      description: 'Get the count of unread notifications for the authenticated user. Useful for displaying notification badges.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Unread count retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UnreadCountResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/api/notifications/read-all': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark all notifications as read',
      description: 'Mark all unread notifications as read for the authenticated user. Returns the count of notifications that were marked as read.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'All notifications marked as read',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MarkAllAsReadResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/api/notifications/read': {
    delete: {
      tags: ['Notifications'],
      summary: 'Delete all read notifications',
      description: 'Bulk delete all read notifications for the authenticated user. Returns the count of deleted notifications.',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'All read notifications deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/DeleteAllReadResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },
  },

  '/api/notifications/{id}': {
    get: {
      tags: ['Notifications'],
      summary: 'Get notification by ID',
      description: 'Get a single notification by ID. User can only access their own notifications.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Notification ID',
          example: 'clnotif123abc456',
        },
      ],
      responses: {
        200: {
          description: 'Notification retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotificationResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
    delete: {
      tags: ['Notifications'],
      summary: 'Delete notification',
      description: 'Delete a single notification by ID. User can only delete their own notifications.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Notification ID',
          example: 'clnotif123abc456',
        },
      ],
      responses: {
        200: {
          description: 'Notification deleted successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotificationDeleteResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/notifications/{id}/read': {
    patch: {
      tags: ['Notifications'],
      summary: 'Mark notification as read',
      description: 'Mark a single notification as read by ID. Sets isRead to true and updates readAt timestamp.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Notification ID',
          example: 'clnotif123abc456',
        },
      ],
      responses: {
        200: {
          description: 'Notification marked as read',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/NotificationResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },
};

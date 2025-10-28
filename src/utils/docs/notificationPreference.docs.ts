/**
 * Notification Preference API Documentation
 * OpenAPI paths for notification preference endpoints
 */

export const notificationPreferencePaths = {
  '/api/users/me/notification-preferences': {
    get: {
      tags: ['Users - Profile'],
      summary: 'Get notification preferences',
      description: 'Get current user\'s notification preferences. Creates default preferences if they don\'t exist.',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Notification preferences retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Notification preferences retrieved successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      preferences: { $ref: '#/components/schemas/NotificationPreferenceResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
      },
    },

    patch: {
      tags: ['Users - Profile'],
      summary: 'Update notification preferences',
      description: 'Update current user\'s notification preferences. All fields are optional - supports partial updates.',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateNotificationPreferenceRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Notification preferences updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Notification preferences updated successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      preferences: { $ref: '#/components/schemas/NotificationPreferenceResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/users/me/notification-preferences/reset': {
    post: {
      tags: ['Users - Profile'],
      summary: 'Reset notification preferences to default',
      description: 'Reset all notification preferences to their default values.',
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: 'Notification preferences reset successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Notification preferences reset to defaults successfully' },
                  data: {
                    type: 'object',
                    properties: {
                      preferences: { $ref: '#/components/schemas/NotificationPreferenceResponse' },
                    },
                  },
                },
              },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },
};

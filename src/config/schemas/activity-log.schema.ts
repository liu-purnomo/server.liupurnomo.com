/**
 * Activity Log Schemas
 * OpenAPI schema definitions for activity log management
 */

export const activityLogSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  UpdateActivityLogRequest: {
    type: 'object',
    properties: {
      severity: {
        type: 'string',
        enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
        example: 'WARNING',
        description: 'Log severity level',
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 1000,
        example: 'Updated user profile information',
        description: 'Human-readable description of the action',
      },
      errorMessage: {
        type: 'string',
        maxLength: 2000,
        nullable: true,
        example: 'Failed to connect to database',
        description: 'Error details if action failed',
      },
    },
  },

  BulkDeleteActivityLogsRequest: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        example: 'clxyz123abc456def',
        description: 'Filter by user ID',
      },
      action: {
        type: 'string',
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER', 'RESET_PASSWORD', 'VERIFY_EMAIL'],
        example: 'READ',
        description: 'Filter by action type',
      },
      entity: {
        type: 'string',
        example: 'User',
        description: 'Filter by entity type',
      },
      success: {
        type: 'boolean',
        example: true,
        description: 'Filter by success/failure status',
      },
      severity: {
        type: 'string',
        enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
        example: 'ERROR',
        description: 'Filter by severity level',
      },
      beforeDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z',
        description: 'Delete logs created before this date',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  ActivityLogResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      userId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
        description: 'User who performed the action (null for system actions)',
      },
      action: {
        type: 'string',
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER', 'RESET_PASSWORD', 'VERIFY_EMAIL'],
        example: 'CREATE',
      },
      entity: {
        type: 'string',
        example: 'Post',
        description: 'Entity type (User, Post, Comment, etc.)',
      },
      entityId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
        description: 'ID of affected entity',
      },
      description: {
        type: 'string',
        example: 'Created new post: Getting Started with Prisma',
      },
      oldData: {
        type: 'object',
        nullable: true,
        description: 'State before change (for UPDATE actions)',
      },
      newData: {
        type: 'object',
        nullable: true,
        description: 'State after change (for UPDATE actions)',
      },
      ipAddress: {
        type: 'string',
        nullable: true,
        example: '192.168.1.1',
        description: 'Client IP address',
      },
      userAgent: {
        type: 'string',
        nullable: true,
        example: 'Mozilla/5.0...',
        description: 'Browser/device information',
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        nullable: true,
        example: 'POST',
        description: 'HTTP method used',
      },
      endpoint: {
        type: 'string',
        nullable: true,
        example: '/api/posts',
        description: 'API endpoint called',
      },
      success: {
        type: 'boolean',
        example: true,
        description: 'Whether action succeeded',
      },
      errorMessage: {
        type: 'string',
        nullable: true,
        example: 'Failed to connect to database',
        description: 'Error details if failed',
      },
      severity: {
        type: 'string',
        enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
        example: 'INFO',
        description: 'Log importance level',
      },
      duration: {
        type: 'integer',
        nullable: true,
        example: 125,
        description: 'Execution time in milliseconds',
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
      user: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'string', example: 'clxyz123abc456def' },
          username: { type: 'string', example: 'johndoe' },
          email: { type: 'string', example: 'john@example.com' },
          name: { type: 'string', nullable: true, example: 'John Doe' },
        },
      },
    },
  },

  ActivityLogListItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      userId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
      },
      action: {
        type: 'string',
        enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER', 'RESET_PASSWORD', 'VERIFY_EMAIL'],
        example: 'CREATE',
      },
      entity: {
        type: 'string',
        example: 'Post',
      },
      entityId: {
        type: 'string',
        nullable: true,
        example: 'clxyz123abc456def',
      },
      description: {
        type: 'string',
        example: 'Created new post: Getting Started with Prisma',
      },
      ipAddress: {
        type: 'string',
        nullable: true,
        example: '192.168.1.1',
      },
      method: {
        type: 'string',
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        nullable: true,
        example: 'POST',
      },
      endpoint: {
        type: 'string',
        nullable: true,
        example: '/api/posts',
      },
      success: {
        type: 'boolean',
        example: true,
      },
      errorMessage: {
        type: 'string',
        nullable: true,
        example: null,
      },
      severity: {
        type: 'string',
        enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'],
        example: 'INFO',
      },
      duration: {
        type: 'integer',
        nullable: true,
        example: 125,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      user: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'string', example: 'clxyz123abc456def' },
          username: { type: 'string', example: 'johndoe' },
          name: { type: 'string', nullable: true, example: 'John Doe' },
        },
      },
    },
  },

  ActivityLogStatsResponse: {
    type: 'object',
    properties: {
      totalLogs: {
        type: 'integer',
        example: 1500,
        description: 'Total number of activity logs',
      },
      successfulActions: {
        type: 'integer',
        example: 1450,
        description: 'Number of successful actions',
      },
      failedActions: {
        type: 'integer',
        example: 50,
        description: 'Number of failed actions',
      },
      byAction: {
        type: 'object',
        additionalProperties: { type: 'integer' },
        example: {
          CREATE: 500,
          READ: 600,
          UPDATE: 250,
          DELETE: 100,
          LOGIN: 50,
        },
        description: 'Count of logs grouped by action type',
      },
      bySeverity: {
        type: 'object',
        additionalProperties: { type: 'integer' },
        example: {
          INFO: 1400,
          WARNING: 75,
          ERROR: 20,
          CRITICAL: 5,
        },
        description: 'Count of logs grouped by severity level',
      },
      byEntity: {
        type: 'object',
        additionalProperties: { type: 'integer' },
        example: {
          User: 300,
          Post: 600,
          Comment: 400,
          Category: 200,
        },
        description: 'Count of logs grouped by entity type',
      },
      averageDuration: {
        type: 'number',
        nullable: true,
        example: 125.5,
        description: 'Average execution time in milliseconds',
      },
    },
  },
};

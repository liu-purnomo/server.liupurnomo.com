/**
 * Common Schemas
 * Shared OpenAPI schema definitions for standard API responses
 */

export const commonSchemas = {
  /**
   * Generic Error Schema
   */
  Error: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'An error occurred',
      },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string' },
            message: { type: 'string' },
            code: { type: 'string' },
          },
        },
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      path: {
        type: 'string',
      },
    },
    required: ['success', 'message'],
  },

  /**
   * Standard API Error object
   */
  ApiError: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        example: 'VALIDATION_ERROR',
        description: 'Error code for programmatic handling',
      },
      field: {
        type: 'string',
        example: 'email',
        description: 'Field name that caused the error (for validation errors)',
      },
      message: {
        type: 'string',
        example: 'Invalid email format',
        description: 'Human-readable error message',
      },
      details: {
        type: 'object',
        additionalProperties: true,
        description: 'Additional error details',
      },
    },
    required: ['message'],
  },

  /**
   * Pagination metadata
   */
  PaginationMeta: {
    type: 'object',
    properties: {
      currentPage: {
        type: 'integer',
        example: 1,
        description: 'Current page number',
      },
      itemsPerPage: {
        type: 'integer',
        example: 10,
        description: 'Number of items per page',
      },
      totalItems: {
        type: 'integer',
        example: 100,
        description: 'Total number of items',
      },
      totalPages: {
        type: 'integer',
        example: 10,
        description: 'Total number of pages',
      },
      hasNextPage: {
        type: 'boolean',
        example: true,
        description: 'Whether there is a next page',
      },
      hasPreviousPage: {
        type: 'boolean',
        example: false,
        description: 'Whether there is a previous page',
      },
    },
    required: ['currentPage', 'itemsPerPage', 'totalItems', 'totalPages'],
  },

  /**
   * Success Response (generic)
   */
  SuccessResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
        description: 'Indicates the request was successful',
      },
      message: {
        type: 'string',
        example: 'Operation completed successfully',
        description: 'Human-readable success message',
      },
      data: {
        type: 'object',
        description: 'Response data (structure varies by endpoint)',
      },
      pagination: {
        $ref: '#/components/schemas/PaginationMeta',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
        description: 'ISO 8601 timestamp of the response',
      },
      path: {
        type: 'string',
        example: '/api/users',
        description: 'Request path that generated this response',
      },
    },
    required: ['success', 'message'],
  },

  /**
   * Error Response
   */
  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Indicates the request failed',
      },
      message: {
        type: 'string',
        example: 'An error occurred',
        description: 'Human-readable error message',
      },
      errors: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ApiError',
        },
        description: 'Array of detailed error objects',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
        description: 'ISO 8601 timestamp of the response',
      },
      path: {
        type: 'string',
        example: '/api/users',
        description: 'Request path that generated this response',
      },
    },
    required: ['success', 'message'],
  },

  /**
   * Validation Error Response (422)
   */
  ValidationErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Validation failed',
      },
      errors: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ApiError',
        },
        example: [
          {
            field: 'email',
            message: 'Invalid email format',
            code: 'INVALID_EMAIL',
          },
          {
            field: 'password',
            message: 'Password must be at least 8 characters',
            code: 'PASSWORD_TOO_SHORT',
          },
        ],
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      path: {
        type: 'string',
      },
    },
    required: ['success', 'message', 'errors'],
  },

  /**
   * Unauthorized Error Response (401)
   */
  UnauthorizedResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Unauthorized',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      path: {
        type: 'string',
      },
    },
  },

  /**
   * Forbidden Error Response (403)
   */
  ForbiddenResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Forbidden',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      path: {
        type: 'string',
      },
    },
  },

  /**
   * Not Found Error Response (404)
   */
  NotFoundResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Resource not found',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      path: {
        type: 'string',
      },
    },
  },

  /**
   * Internal Server Error Response (500)
   */
  InternalErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      message: {
        type: 'string',
        example: 'Internal server error',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      path: {
        type: 'string',
      },
    },
  },
};

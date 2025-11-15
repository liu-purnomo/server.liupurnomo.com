/**
 * Event API Documentation
 * OpenAPI path definitions for Event endpoints
 */

export const eventPaths = {
  '/api/events': {
    get: {
      tags: ['Events'],
      summary: 'Get all events',
      description:
        'Retrieve paginated list of events with optional filters (public access)',
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: { type: 'integer', default: 1 },
          description: 'Page number',
        },
        {
          name: 'limit',
          in: 'query',
          schema: { type: 'integer', default: 10 },
          description: 'Items per page',
        },
        {
          name: 'search',
          in: 'query',
          schema: { type: 'string' },
          description: 'Search in title, description, city, venue, organizer',
        },
        {
          name: 'eventType',
          in: 'query',
          schema: { $ref: '#/components/schemas/EventType' },
          description: 'Filter by event type',
        },
        {
          name: 'status',
          in: 'query',
          schema: { $ref: '#/components/schemas/EventStatus' },
          description: 'Filter by status',
        },
        {
          name: 'locationType',
          in: 'query',
          schema: { $ref: '#/components/schemas/EventLocationType' },
          description: 'Filter by location type',
        },
        {
          name: 'city',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by city',
        },
        {
          name: 'country',
          in: 'query',
          schema: { type: 'string' },
          description: 'Filter by country',
        },
        {
          name: 'year',
          in: 'query',
          schema: { type: 'integer' },
          description: 'Filter by event year',
        },
        {
          name: 'month',
          in: 'query',
          schema: { type: 'integer', minimum: 1, maximum: 12 },
          description: 'Filter by event month (1-12, requires year)',
        },
        {
          name: 'sortBy',
          in: 'query',
          schema: {
            type: 'string',
            enum: [
              'eventDate',
              'createdAt',
              'updatedAt',
              'title',
              'viewCount',
              'participants',
            ],
            default: 'eventDate',
          },
          description: 'Sort by field',
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
          description: 'Events retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Events retrieved successfully' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/EventListItemResponse' },
                  },
                  pagination: { $ref: '#/components/schemas/Pagination' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
      },
    },
    post: {
      tags: ['Events'],
      summary: 'Create event',
      description: 'Create new event (requires ADMIN or AUTHOR role)',
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateEventRequest' },
          },
        },
      },
      responses: {
        201: {
          description: 'Event created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Event created successfully' },
                  data: { $ref: '#/components/schemas/EventResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
  },

  '/api/events/slug/{slug}': {
    get: {
      tags: ['Events'],
      summary: 'Get event by slug',
      description:
        'Retrieve event by slug (public access - only published events)',
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Event slug',
          example: 'workshop-intro-typescript',
        },
      ],
      responses: {
        200: {
          description: 'Event retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Event retrieved successfully' },
                  data: { $ref: '#/components/schemas/EventResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        404: { $ref: '#/components/responses/NotFound' },
      },
    },
  },

  '/api/events/{id}': {
    get: {
      tags: ['Events'],
      summary: 'Get event by ID',
      description: 'Retrieve event by ID (requires ADMIN or AUTHOR role)',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Event ID',
          example: 'clx1y2z3a0000qwerty12345',
        },
      ],
      responses: {
        200: {
          description: 'Event retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Event retrieved successfully' },
                  data: { $ref: '#/components/schemas/EventResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
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
      tags: ['Events'],
      summary: 'Update event',
      description: 'Update existing event (requires ADMIN or AUTHOR role)',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Event ID',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateEventRequest' },
          },
        },
      },
      responses: {
        200: {
          description: 'Event updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Event updated successfully' },
                  data: { $ref: '#/components/schemas/EventResponse' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
                },
              },
            },
          },
        },
        400: { $ref: '#/components/responses/BadRequest' },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
        404: { $ref: '#/components/responses/NotFound' },
        409: { $ref: '#/components/responses/Conflict' },
        422: { $ref: '#/components/responses/ValidationError' },
      },
    },
    delete: {
      tags: ['Events'],
      summary: 'Delete event',
      description: 'Delete event permanently (requires ADMIN or AUTHOR role)',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Event ID',
        },
      ],
      responses: {
        200: {
          description: 'Event deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: { type: 'string', example: 'Event deleted successfully' },
                  data: { type: 'null' },
                  timestamp: { type: 'string', format: 'date-time' },
                  path: { type: 'string' },
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

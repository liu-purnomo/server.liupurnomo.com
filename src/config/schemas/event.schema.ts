/**
 * Event OpenAPI Schemas
 */

export const eventSchemas = {
  // ==================== EVENT TYPES ====================

  EventType: {
    type: 'string',
    enum: [
      'WORKSHOP',
      'TRAINING',
      'SEMINAR',
      'CONFERENCE',
      'MEETUP',
      'WEBINAR',
      'HACKATHON',
      'TALK',
      'OTHER',
    ],
    description: 'Type of event',
  },

  EventStatus: {
    type: 'string',
    enum: ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
    description: 'Event publication status',
  },

  EventLocationType: {
    type: 'string',
    enum: ['ONLINE', 'OFFLINE', 'HYBRID'],
    description: 'Event location type',
  },

  // ==================== REQUEST SCHEMAS ====================

  CreateEventRequest: {
    type: 'object',
    required: ['title', 'slug', 'eventType', 'locationType', 'eventDate'],
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        example: 'Workshop: Introduction to TypeScript',
      },
      slug: {
        type: 'string',
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'workshop-intro-typescript',
      },
      description: {
        type: 'string',
        maxLength: 1000,
        example:
          'A comprehensive workshop for beginners to learn TypeScript fundamentals',
      },
      content: {
        type: 'object',
        description: 'Rich content in JSON format',
      },
      eventType: {
        $ref: '#/components/schemas/EventType',
      },
      status: {
        $ref: '#/components/schemas/EventStatus',
        default: 'DRAFT',
      },
      locationType: {
        $ref: '#/components/schemas/EventLocationType',
      },
      eventDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-02-15T09:00:00Z',
      },
      startTime: {
        type: 'string',
        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
        example: '09:00',
      },
      endTime: {
        type: 'string',
        pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$',
        example: '17:00',
      },
      timezone: {
        type: 'string',
        default: 'Asia/Jakarta',
        example: 'Asia/Jakarta',
      },
      venue: {
        type: 'string',
        maxLength: 200,
        example: 'Grand Conference Hall',
      },
      address: {
        type: 'string',
        maxLength: 500,
        example: 'Jl. Sudirman No. 123, Jakarta Selatan',
      },
      city: {
        type: 'string',
        maxLength: 100,
        example: 'Jakarta',
      },
      country: {
        type: 'string',
        maxLength: 100,
        default: 'Indonesia',
        example: 'Indonesia',
      },
      mapUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://maps.google.com/?q=Grand+Conference+Hall',
      },
      platformName: {
        type: 'string',
        maxLength: 100,
        example: 'Zoom',
      },
      platformUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://zoom.us/j/123456789',
      },
      organizerName: {
        type: 'string',
        maxLength: 200,
        example: 'Tech Community Indonesia',
      },
      organizerUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://techcommunity.id',
      },
      role: {
        type: 'string',
        maxLength: 100,
        example: 'Speaker',
      },
      topics: {
        type: 'array',
        items: { type: 'string', maxLength: 100 },
        maxItems: 20,
        example: ['TypeScript', 'Web Development', 'JavaScript'],
      },
      participants: {
        type: 'integer',
        minimum: 0,
        example: 50,
      },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        example: 'https://example.com/images/event-banner.jpg',
      },
      galleryImages: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        maxItems: 50,
        example: [
          'https://example.com/images/photo1.jpg',
          'https://example.com/images/photo2.jpg',
        ],
      },
      metaTitle: {
        type: 'string',
        maxLength: 200,
      },
      metaDescription: {
        type: 'string',
        maxLength: 500,
      },
      metaKeywords: {
        type: 'array',
        items: { type: 'string', maxLength: 50 },
        maxItems: 20,
      },
      ogImageUrl: {
        type: 'string',
        format: 'uri',
      },
      canonicalUrl: {
        type: 'string',
        format: 'uri',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  UpdateEventRequest: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 200 },
      slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
      description: { type: 'string', maxLength: 1000 },
      content: { type: 'object' },
      eventType: { $ref: '#/components/schemas/EventType' },
      status: { $ref: '#/components/schemas/EventStatus' },
      locationType: { $ref: '#/components/schemas/EventLocationType' },
      eventDate: { type: 'string', format: 'date-time' },
      startTime: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
      endTime: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
      timezone: { type: 'string' },
      venue: { type: 'string', maxLength: 200 },
      address: { type: 'string', maxLength: 500 },
      city: { type: 'string', maxLength: 100 },
      country: { type: 'string', maxLength: 100 },
      mapUrl: { type: 'string', format: 'uri' },
      platformName: { type: 'string', maxLength: 100 },
      platformUrl: { type: 'string', format: 'uri' },
      organizerName: { type: 'string', maxLength: 200 },
      organizerUrl: { type: 'string', format: 'uri' },
      role: { type: 'string', maxLength: 100 },
      topics: {
        type: 'array',
        items: { type: 'string', maxLength: 100 },
        maxItems: 20,
      },
      participants: { type: 'integer', minimum: 0 },
      featuredImageUrl: { type: 'string', format: 'uri' },
      galleryImages: {
        type: 'array',
        items: { type: 'string', format: 'uri' },
        maxItems: 50,
      },
      metaTitle: { type: 'string', maxLength: 200 },
      metaDescription: { type: 'string', maxLength: 500 },
      metaKeywords: {
        type: 'array',
        items: { type: 'string', maxLength: 50 },
        maxItems: 20,
      },
      ogImageUrl: { type: 'string', format: 'uri' },
      canonicalUrl: { type: 'string', format: 'uri' },
      publishedAt: { type: 'string', format: 'date-time' },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  EventResponse: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clx1y2z3a0000qwerty12345' },
      title: { type: 'string', example: 'Workshop: Introduction to TypeScript' },
      slug: { type: 'string', example: 'workshop-intro-typescript' },
      description: {
        type: 'string',
        nullable: true,
        example:
          'A comprehensive workshop for beginners to learn TypeScript fundamentals',
      },
      content: { type: 'object', nullable: true },
      eventType: { $ref: '#/components/schemas/EventType' },
      status: { $ref: '#/components/schemas/EventStatus' },
      locationType: { $ref: '#/components/schemas/EventLocationType' },
      eventDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-02-15T09:00:00Z',
      },
      startTime: { type: 'string', nullable: true, example: '09:00' },
      endTime: { type: 'string', nullable: true, example: '17:00' },
      timezone: { type: 'string', example: 'Asia/Jakarta' },
      venue: { type: 'string', nullable: true, example: 'Grand Conference Hall' },
      address: {
        type: 'string',
        nullable: true,
        example: 'Jl. Sudirman No. 123, Jakarta Selatan',
      },
      city: { type: 'string', nullable: true, example: 'Jakarta' },
      country: { type: 'string', nullable: true, example: 'Indonesia' },
      mapUrl: {
        type: 'string',
        nullable: true,
        example: 'https://maps.google.com/?q=Grand+Conference+Hall',
      },
      platformName: { type: 'string', nullable: true, example: 'Zoom' },
      platformUrl: {
        type: 'string',
        nullable: true,
        example: 'https://zoom.us/j/123456789',
      },
      organizerName: {
        type: 'string',
        nullable: true,
        example: 'Tech Community Indonesia',
      },
      organizerUrl: {
        type: 'string',
        nullable: true,
        example: 'https://techcommunity.id',
      },
      role: { type: 'string', nullable: true, example: 'Speaker' },
      topics: {
        type: 'array',
        items: { type: 'string' },
        example: ['TypeScript', 'Web Development', 'JavaScript'],
      },
      participants: { type: 'integer', nullable: true, example: 50 },
      featuredImageUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/images/event-banner.jpg',
      },
      galleryImages: {
        type: 'array',
        items: { type: 'string' },
        example: [
          'https://example.com/images/photo1.jpg',
          'https://example.com/images/photo2.jpg',
        ],
      },
      metaTitle: { type: 'string', nullable: true },
      metaDescription: { type: 'string', nullable: true },
      metaKeywords: { type: 'array', items: { type: 'string' } },
      ogImageUrl: { type: 'string', nullable: true },
      canonicalUrl: { type: 'string', nullable: true },
      viewCount: { type: 'integer', example: 150 },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-15T10:00:00Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-14T10:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-14T10:00:00Z',
      },
    },
  },

  EventListItemResponse: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      slug: { type: 'string' },
      description: { type: 'string', nullable: true },
      eventType: { $ref: '#/components/schemas/EventType' },
      status: { $ref: '#/components/schemas/EventStatus' },
      locationType: { $ref: '#/components/schemas/EventLocationType' },
      eventDate: { type: 'string', format: 'date-time' },
      city: { type: 'string', nullable: true },
      country: { type: 'string', nullable: true },
      venue: { type: 'string', nullable: true },
      role: { type: 'string', nullable: true },
      topics: { type: 'array', items: { type: 'string' } },
      participants: { type: 'integer', nullable: true },
      featuredImageUrl: { type: 'string', nullable: true },
      viewCount: { type: 'integer' },
      publishedAt: { type: 'string', format: 'date-time', nullable: true },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
};

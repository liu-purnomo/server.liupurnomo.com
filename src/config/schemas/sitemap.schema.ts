/**
 * Sitemap Schemas
 * OpenAPI schema definitions for sitemap
 */

export const sitemapSchemas = {
  // ==================== DATA SCHEMAS ====================

  SitemapPost: {
    type: 'object',
    properties: {
      slug: { type: 'string', example: 'getting-started-with-typescript' },
      title: { type: 'string', example: 'Getting Started with TypeScript' },
      featuredImageUrl: { type: 'string', format: 'uri', nullable: true, example: 'https://server.liupurnomo.com/uploads/post-featured.jpg' },
      excerpt: { type: 'string', nullable: true, example: 'Learn the fundamentals of TypeScript and how to get started' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
      publishedAt: { type: 'string', format: 'date-time', nullable: true, example: '2025-11-14T08:00:00Z' },
    },
  },

  SitemapCategory: {
    type: 'object',
    properties: {
      slug: { type: 'string', example: 'web-development' },
      name: { type: 'string', example: 'Web Development' },
      description: { type: 'string', nullable: true, example: 'Everything about modern web development' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
    },
  },

  SitemapTag: {
    type: 'object',
    properties: {
      slug: { type: 'string', example: 'typescript' },
      name: { type: 'string', example: 'TypeScript' },
      description: { type: 'string', nullable: true, example: 'Typed superset of JavaScript' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
    },
  },

  SitemapMedia: {
    type: 'object',
    properties: {
      fileUrl: { type: 'string', format: 'uri', example: 'https://server.liupurnomo.com/uploads/image.jpg' },
      fileName: { type: 'string', example: 'header-image.jpg' },
      caption: { type: 'string', nullable: true, example: 'Beautiful header image for blog post' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
    },
  },

  SitemapEvent: {
    type: 'object',
    properties: {
      slug: { type: 'string', example: 'react-conference-2025' },
      title: { type: 'string', example: 'React Conference 2025' },
      featuredImageUrl: { type: 'string', format: 'uri', nullable: true, example: 'https://server.liupurnomo.com/uploads/event-banner.jpg' },
      description: { type: 'string', nullable: true, example: 'Join us for the biggest React conference of 2025' },
      updatedAt: { type: 'string', format: 'date-time', example: '2025-11-15T10:30:00Z' },
      eventDate: { type: 'string', format: 'date-time', example: '2025-12-01T09:00:00Z' },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  SitemapData: {
    type: 'object',
    properties: {
      posts: {
        type: 'array',
        items: { $ref: '#/components/schemas/SitemapPost' },
      },
      categories: {
        type: 'array',
        items: { $ref: '#/components/schemas/SitemapCategory' },
      },
      tags: {
        type: 'array',
        items: { $ref: '#/components/schemas/SitemapTag' },
      },
      media: {
        type: 'array',
        items: { $ref: '#/components/schemas/SitemapMedia' },
      },
      events: {
        type: 'array',
        items: { $ref: '#/components/schemas/SitemapEvent' },
      },
    },
  },

  SitemapResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Sitemap data retrieved successfully' },
      data: { $ref: '#/components/schemas/SitemapData' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },
};

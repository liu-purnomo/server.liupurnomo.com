/**
 * Tag Schemas
 * OpenAPI schema definitions for tag management
 */

export const tagSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  CreateTagRequest: {
    type: 'object',
    required: ['name', 'slug'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        example: 'JavaScript',
        description: 'Tag name',
      },
      slug: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'javascript',
        description: 'URL-friendly slug (lowercase letters, numbers, and hyphens only)',
      },
      description: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Everything about JavaScript programming language',
      },
      metaTitle: {
        type: 'string',
        maxLength: 60,
        nullable: true,
        example: 'JavaScript Articles and Tutorials',
      },
      metaDescription: {
        type: 'string',
        maxLength: 160,
        nullable: true,
        example: 'Explore our collection of JavaScript articles, tutorials, and resources',
      },
    },
  },

  UpdateTagRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        example: 'JavaScript',
      },
      slug: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'javascript',
      },
      description: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Everything about JavaScript programming language',
      },
      metaTitle: {
        type: 'string',
        maxLength: 60,
        nullable: true,
        example: 'JavaScript Articles and Tutorials',
      },
      metaDescription: {
        type: 'string',
        maxLength: 160,
        nullable: true,
        example: 'Explore our collection of JavaScript articles, tutorials, and resources',
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  TagResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      name: {
        type: 'string',
        example: 'JavaScript',
      },
      slug: {
        type: 'string',
        example: 'javascript',
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'Everything about JavaScript programming language',
      },
      metaTitle: {
        type: 'string',
        nullable: true,
        example: 'JavaScript Articles and Tutorials',
      },
      metaDescription: {
        type: 'string',
        nullable: true,
        example: 'Explore our collection of JavaScript articles, tutorials, and resources',
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
      _count: {
        type: 'object',
        properties: {
          postTags: {
            type: 'integer',
            example: 25,
            description: 'Number of posts with this tag',
          },
        },
      },
    },
  },

  TagListItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clxyz123abc456def',
      },
      name: {
        type: 'string',
        example: 'JavaScript',
      },
      slug: {
        type: 'string',
        example: 'javascript',
      },
      description: {
        type: 'string',
        nullable: true,
        example: 'Everything about JavaScript programming language',
      },
      _count: {
        type: 'object',
        properties: {
          postTags: {
            type: 'integer',
            example: 25,
          },
        },
      },
    },
  },
};

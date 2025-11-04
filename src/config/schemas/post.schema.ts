/**
 * Post Schemas
 * OpenAPI schema definitions for post management
 */

export const postSchemas = {
  // ==================== REQUEST SCHEMAS ====================

  CreatePostRequest: {
    type: 'object',
    required: ['title', 'slug', 'categoryId', 'content'],
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        example: 'Getting Started with TypeScript',
        description: 'Post title',
      },
      slug: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'getting-started-with-typescript',
        description: 'URL-friendly identifier (lowercase, hyphen-separated)',
      },
      categoryId: {
        type: 'string',
        example: 'clcat123abc456def',
        description: 'Category ID',
      },
      excerpt: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Learn the basics of TypeScript and how to get started with your first project.',
        description: 'Short summary for listings',
      },
      content: {
        type: 'array',
        items: { type: 'object' },
        example: [
          {
            id: 'block_1',
            type: 'heading',
            level: 1,
            content: 'Introduction to TypeScript',
          },
          {
            id: 'block_2',
            type: 'paragraph',
            content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
          },
          {
            id: 'block_3',
            type: 'code',
            language: 'typescript',
            code: 'const greeting: string = "Hello, TypeScript!";',
            caption: 'Basic TypeScript example',
          },
          {
            id: 'block_4',
            type: 'callout',
            variant: 'info',
            title: 'Important',
            content: 'TypeScript adds optional static typing to JavaScript.',
          },
        ],
        description: 'Rich content in JSON array format with custom block types',
      },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
        description: 'Featured image URL from media library',
      },
      postType: {
        type: 'string',
        enum: ['BLOG', 'TUTORIAL'],
        default: 'BLOG',
        example: 'BLOG',
        description: 'Type of post',
      },
      status: {
        type: 'string',
        enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
        default: 'DRAFT',
        example: 'DRAFT',
        description: 'Post status',
      },
      tagIds: {
        type: 'array',
        items: { type: 'string' },
        example: ['cltag1abc', 'cltag2def'],
        description: 'Array of tag IDs',
      },
      metaTitle: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        example: 'Getting Started with TypeScript - Complete Guide',
        description: 'Custom SEO title (defaults to title)',
      },
      metaDescription: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'A comprehensive guide to getting started with TypeScript, covering installation, basic types, and your first project.',
        description: 'Meta description for search engines',
      },
      metaKeywords: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        example: 'typescript, javascript, programming, web development',
        description: 'Comma-separated keywords for SEO',
      },
      ogImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/og-image-123.webp',
        description: 'Open Graph image URL for social sharing',
      },
      canonicalUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://liupurnomo.com/blog/getting-started-with-typescript',
        description: 'Canonical URL to prevent duplicate content',
      },
      difficultyLevel: {
        type: 'string',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        nullable: true,
        example: 'BEGINNER',
        description: 'Tutorial difficulty level (null for blog posts)',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-15T10:00:00.000Z',
        description: 'Publication timestamp',
      },
      scheduledAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-20T09:00:00.000Z',
        description: 'Scheduled publication time',
      },
      readingTime: {
        type: 'integer',
        minimum: 1,
        nullable: true,
        example: 5,
        description: 'Estimated reading time in minutes',
      },
    },
  },

  UpdatePostRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        example: 'Getting Started with TypeScript',
      },
      slug: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
        example: 'getting-started-with-typescript',
      },
      categoryId: {
        type: 'string',
        example: 'clcat123abc456def',
      },
      excerpt: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'Learn the basics of TypeScript and how to get started with your first project.',
      },
      content: {
        type: 'array',
        items: { type: 'object' },
        example: [
          {
            id: 'block_1',
            type: 'heading',
            level: 1,
            content: 'Introduction to TypeScript',
          },
          {
            id: 'block_2',
            type: 'paragraph',
            content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
          },
          {
            id: 'block_3',
            type: 'code',
            language: 'typescript',
            code: 'const greeting: string = "Hello, TypeScript!";',
            caption: 'Basic TypeScript example',
          },
        ],
      },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
      },
      postType: {
        type: 'string',
        enum: ['BLOG', 'TUTORIAL'],
        example: 'BLOG',
      },
      status: {
        type: 'string',
        enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
        example: 'PUBLISHED',
      },
      tagIds: {
        type: 'array',
        items: { type: 'string' },
        example: ['cltag1abc', 'cltag2def'],
      },
      metaTitle: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        example: 'Getting Started with TypeScript - Complete Guide',
      },
      metaDescription: {
        type: 'string',
        maxLength: 500,
        nullable: true,
        example: 'A comprehensive guide to getting started with TypeScript.',
      },
      metaKeywords: {
        type: 'string',
        maxLength: 255,
        nullable: true,
        example: 'typescript, javascript, programming',
      },
      ogImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/og-image-123.webp',
      },
      canonicalUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://liupurnomo.com/blog/getting-started-with-typescript',
      },
      difficultyLevel: {
        type: 'string',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        nullable: true,
        example: 'BEGINNER',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-15T10:00:00.000Z',
      },
      scheduledAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-20T09:00:00.000Z',
      },
      readingTime: {
        type: 'integer',
        minimum: 1,
        nullable: true,
        example: 5,
      },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  PostAuthor: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'cluserid123456def',
      },
      name: {
        type: 'string',
        nullable: true,
        example: 'John Doe',
      },
      username: {
        type: 'string',
        nullable: true,
        example: 'johndoe',
      },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/avatars/abc123.webp',
      },
    },
  },

  PostCategory: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clcat123abc456def',
      },
      name: {
        type: 'string',
        example: 'Web Development',
      },
      slug: {
        type: 'string',
        example: 'web-development',
      },
    },
  },

  PostTag: {
    type: 'object',
    properties: {
      tag: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'cltag123abc456def',
          },
          name: {
            type: 'string',
            example: 'TypeScript',
          },
          slug: {
            type: 'string',
            example: 'typescript',
          },
        },
      },
    },
  },

  PostResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      authorId: {
        type: 'string',
        example: 'cluserid123456def',
      },
      categoryId: {
        type: 'string',
        example: 'clcat123abc456def',
      },
      title: {
        type: 'string',
        example: 'Getting Started with TypeScript',
      },
      slug: {
        type: 'string',
        example: 'getting-started-with-typescript',
      },
      excerpt: {
        type: 'string',
        nullable: true,
        example: 'Learn the basics of TypeScript and how to get started with your first project.',
      },
      content: {
        type: 'array',
        items: { type: 'object' },
        example: [
          {
            id: 'block_1',
            type: 'heading',
            level: 1,
            content: 'Introduction to TypeScript',
          },
          {
            id: 'block_2',
            type: 'paragraph',
            content: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
          },
          {
            id: 'block_3',
            type: 'list',
            ordered: false,
            items: ['Static typing', 'Better IDE support', 'Compile-time error checking'],
          },
          {
            id: 'block_4',
            type: 'code',
            language: 'typescript',
            code: 'const greeting: string = "Hello, TypeScript!";',
            caption: 'Basic TypeScript example',
          },
        ],
      },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
      },
      postType: {
        type: 'string',
        enum: ['BLOG', 'TUTORIAL'],
        example: 'BLOG',
      },
      status: {
        type: 'string',
        enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
        example: 'PUBLISHED',
      },
      metaTitle: {
        type: 'string',
        nullable: true,
        example: 'Getting Started with TypeScript - Complete Guide',
      },
      metaDescription: {
        type: 'string',
        nullable: true,
        example: 'A comprehensive guide to getting started with TypeScript.',
      },
      metaKeywords: {
        type: 'string',
        nullable: true,
        example: 'typescript, javascript, programming, web development',
      },
      ogImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/og-image-123.webp',
      },
      canonicalUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://liupurnomo.com/blog/getting-started-with-typescript',
      },
      viewCount: {
        type: 'integer',
        example: 1234,
      },
      readingTime: {
        type: 'integer',
        nullable: true,
        example: 5,
      },
      difficultyLevel: {
        type: 'string',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        nullable: true,
        example: 'BEGINNER',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-15T10:00:00.000Z',
      },
      scheduledAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-20T09:00:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T08:30:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:30:00.000Z',
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: null,
      },
      author: {
        $ref: '#/components/schemas/PostAuthor',
      },
      category: {
        $ref: '#/components/schemas/PostCategory',
      },
      postTags: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/PostTag',
        },
      },
    },
  },

  PostListItemResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      title: {
        type: 'string',
        example: 'Getting Started with TypeScript',
      },
      slug: {
        type: 'string',
        example: 'getting-started-with-typescript',
      },
      excerpt: {
        type: 'string',
        nullable: true,
        example: 'Learn the basics of TypeScript and how to get started with your first project.',
      },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/abc123-large.webp',
      },
      postType: {
        type: 'string',
        enum: ['BLOG', 'TUTORIAL'],
        example: 'BLOG',
      },
      status: {
        type: 'string',
        enum: ['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED'],
        example: 'PUBLISHED',
      },
      viewCount: {
        type: 'integer',
        example: 1234,
      },
      readingTime: {
        type: 'integer',
        nullable: true,
        example: 5,
      },
      difficultyLevel: {
        type: 'string',
        enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
        nullable: true,
        example: 'BEGINNER',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-15T10:00:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T08:30:00.000Z',
      },
      author: {
        $ref: '#/components/schemas/PostAuthor',
      },
      category: {
        $ref: '#/components/schemas/PostCategory',
      },
      postTags: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/PostTag',
        },
      },
    },
  },
};

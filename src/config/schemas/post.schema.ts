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
      bio: {
        type: 'string',
        nullable: true,
        example: 'Full-stack developer passionate about TypeScript and web development.',
      },
      location: {
        type: 'string',
        nullable: true,
        example: 'San Francisco, CA',
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
      description: {
        type: 'string',
        nullable: true,
        example: 'Articles about web development, frameworks, and best practices.',
      },
      iconUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/icons/web-dev-icon.svg',
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
          description: {
            type: 'string',
            nullable: true,
            example: 'TypeScript programming language and related topics',
          },
        },
      },
    },
  },

  PostSeriesItem: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clseriesitem123',
      },
      seriesId: {
        type: 'string',
        example: 'clseries123abc',
      },
      postId: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      orderPosition: {
        type: 'integer',
        example: 1,
      },
      series: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clseries123abc',
          },
          title: {
            type: 'string',
            example: 'TypeScript Fundamentals Series',
          },
          slug: {
            type: 'string',
            example: 'typescript-fundamentals',
          },
          description: {
            type: 'string',
            nullable: true,
            example: 'A complete guide to learning TypeScript from basics to advanced',
          },
          thumbnailUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://api.example.com/uploads/series/typescript-thumb.webp',
          },
        },
      },
    },
  },

  PostComment: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clcomment123abc',
      },
      postId: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      userId: {
        type: 'string',
        nullable: true,
        example: 'cluserid123456def',
      },
      content: {
        type: 'array',
        items: { type: 'object' },
        example: [{ type: 'paragraph', content: 'Great article!' }],
      },
      isPinned: {
        type: 'boolean',
        example: false,
      },
      isFeatured: {
        type: 'boolean',
        example: false,
      },
      isAuthorReply: {
        type: 'boolean',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:00:00.000Z',
      },
      user: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'cluserid123456def',
          },
          username: {
            type: 'string',
            example: 'johndoe',
          },
          name: {
            type: 'string',
            nullable: true,
            example: 'John Doe',
          },
          avatarUrl: {
            type: 'string',
            format: 'uri',
            nullable: true,
            example: 'https://api.example.com/uploads/avatars/abc123.webp',
          },
        },
      },
      _count: {
        type: 'object',
        properties: {
          replies: {
            type: 'integer',
            example: 3,
          },
          commentReactions: {
            type: 'integer',
            example: 12,
          },
        },
      },
    },
  },

  PostInlineComment: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clinline123abc',
      },
      postId: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      userId: {
        type: 'string',
        nullable: true,
        example: 'cluserid123456def',
      },
      startOffset: {
        type: 'integer',
        example: 100,
      },
      endOffset: {
        type: 'integer',
        example: 150,
      },
      selectedText: {
        type: 'string',
        example: 'TypeScript is a typed superset of JavaScript',
      },
      blockId: {
        type: 'string',
        nullable: true,
        example: 'block_2',
      },
      content: {
        type: 'string',
        example: 'This is a key point that beginners should understand.',
      },
      isResolved: {
        type: 'boolean',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:00:00.000Z',
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cluserid123' },
          username: { type: 'string', example: 'reviewer' },
          name: { type: 'string', nullable: true, example: 'Reviewer Name' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
        },
      },
      _count: {
        type: 'object',
        properties: {
          replies: { type: 'integer', example: 2 },
          reactions: { type: 'integer', example: 5 },
        },
      },
    },
  },

  PostParagraphReaction: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clreaction123abc',
      },
      postId: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      userId: {
        type: 'string',
        nullable: true,
        example: 'cluserid123456def',
      },
      blockId: {
        type: 'string',
        nullable: true,
        example: 'block_3',
      },
      paragraphId: {
        type: 'string',
        nullable: true,
        example: 'para_2',
      },
      reactionType: {
        type: 'string',
        enum: ['LIKE', 'HELPFUL', 'LOVE', 'INSIGHTFUL', 'AMAZING'],
        example: 'HELPFUL',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:00:00.000Z',
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cluserid123' },
          username: { type: 'string', example: 'reader' },
          name: { type: 'string', nullable: true, example: 'Reader Name' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
        },
      },
    },
  },

  PostHighlight: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clhighlight123abc',
      },
      postId: {
        type: 'string',
        example: 'clpost123abc456def',
      },
      userId: {
        type: 'string',
        example: 'cluserid123456def',
      },
      startOffset: {
        type: 'integer',
        example: 200,
      },
      endOffset: {
        type: 'integer',
        example: 280,
      },
      selectedText: {
        type: 'string',
        example: 'TypeScript adds optional static typing to JavaScript',
      },
      blockId: {
        type: 'string',
        nullable: true,
        example: 'block_4',
      },
      color: {
        type: 'string',
        example: '#FFEB3B',
      },
      isPublic: {
        type: 'boolean',
        example: true,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T10:00:00.000Z',
      },
      user: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cluserid123' },
          username: { type: 'string', example: 'highlighter' },
          name: { type: 'string', nullable: true, example: 'Highlighter Name' },
          avatarUrl: { type: 'string', format: 'uri', nullable: true },
        },
      },
      _count: {
        type: 'object',
        properties: {
          notes: { type: 'integer', example: 1 },
          reactions: { type: 'integer', example: 3 },
          shares: { type: 'integer', example: 0 },
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
      postReactions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'clreact123abc' },
            reactionType: {
              type: 'string',
              enum: ['LIKE', 'HELPFUL', 'LOVE', 'INSIGHTFUL', 'AMAZING'],
              example: 'LIKE',
            },
            createdAt: { type: 'string', format: 'date-time', example: '2025-01-15T10:00:00.000Z' },
            user: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'string', example: 'cluser123' },
                username: { type: 'string', example: 'johndoe' },
                name: { type: 'string', nullable: true, example: 'John Doe' },
                avatarUrl: { type: 'string', nullable: true, example: 'https://api.example.com/avatar.jpg' },
              },
            },
          },
        },
        description: 'Recent post reactions (up to 50)',
      },
      _count: {
        type: 'object',
        properties: {
          comments: { type: 'integer', example: 12 },
          postViews: { type: 'integer', example: 1234 },
          bookmarks: { type: 'integer', example: 45 },
          postReactions: { type: 'integer', example: 156, description: 'Total post reactions count' },
          inlineComments: { type: 'integer', example: 8 },
          paragraphReactions: { type: 'integer', example: 23 },
          highlights: { type: 'integer', example: 15 },
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
      _count: {
        type: 'object',
        properties: {
          comments: {
            type: 'integer',
            example: 12,
            description: 'Number of approved comments',
          },
          bookmarks: {
            type: 'integer',
            example: 45,
            description: 'Number of bookmarks',
          },
        },
      },
    },
  },

  LatestPostItem: {
    type: 'object',
    description: 'Lightweight post item for latest posts sidebar',
    properties: {
      id: {
        type: 'string',
        example: 'clpost789xyz123def',
      },
      title: {
        type: 'string',
        example: 'Advanced TypeScript Patterns',
      },
      slug: {
        type: 'string',
        example: 'advanced-typescript-patterns',
      },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://api.example.com/uploads/media/xyz789-thumb.webp',
      },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-14T12:00:00.000Z',
      },
      readingTime: {
        type: 'integer',
        nullable: true,
        example: 8,
        description: 'Estimated reading time in minutes',
      },
      viewCount: {
        type: 'integer',
        example: 567,
        description: 'Total view count',
      },
      category: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'clcat456xyz',
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
      _count: {
        type: 'object',
        properties: {
          comments: {
            type: 'integer',
            example: 5,
            description: 'Number of approved comments',
          },
        },
      },
    },
  },

  PostDetailResponse: {
    type: 'object',
    description: 'Post detail with related and latest posts',
    properties: {
      post: {
        $ref: '#/components/schemas/PostResponse',
        description: 'Full post details with all relations',
      },
      relatedPosts: {
        type: 'array',
        description: 'Related posts from the same category (max 5)',
        items: {
          $ref: '#/components/schemas/PostListItemResponse',
        },
        example: [
          {
            id: 'clpost456related1',
            title: 'TypeScript Best Practices',
            slug: 'typescript-best-practices',
            excerpt: 'Learn the best practices for writing TypeScript code.',
            featuredImageUrl: 'https://api.example.com/uploads/media/related1.webp',
            postType: 'BLOG',
            status: 'PUBLISHED',
            viewCount: 892,
            readingTime: 6,
            difficultyLevel: 'INTERMEDIATE',
            publishedAt: '2025-01-10T10:00:00.000Z',
            createdAt: '2025-01-10T08:00:00.000Z',
          },
        ],
      },
      latestPosts: {
        type: 'array',
        description: 'Latest published posts for sidebar (max 5)',
        items: {
          $ref: '#/components/schemas/LatestPostItem',
        },
        example: [
          {
            id: 'clpost789latest1',
            title: 'JavaScript ES2024 Features',
            slug: 'javascript-es2024-features',
            featuredImageUrl: 'https://api.example.com/uploads/media/latest1.webp',
            publishedAt: '2025-01-16T09:00:00.000Z',
            readingTime: 7,
            viewCount: 234,
            category: {
              id: 'clcat123js',
              name: 'JavaScript',
              slug: 'javascript',
            },
            _count: {
              comments: 8,
            },
          },
        ],
      },
      userBookmark: {
        oneOf: [
          {
            type: 'object',
            description: 'User bookmark details (only included if user is authenticated and has bookmarked this post)',
            properties: {
              id: {
                type: 'string',
                example: 'clbookmark123',
                description: 'Bookmark ID',
              },
              isFavorite: {
                type: 'boolean',
                example: true,
                description: 'Whether post is marked as favorite',
              },
              isRead: {
                type: 'boolean',
                example: false,
                description: 'Whether post has been read',
              },
              note: {
                type: 'string',
                nullable: true,
                example: 'Great article about TypeScript!',
                description: 'Personal note on bookmark (max 5000 chars)',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                example: ['typescript', 'tutorial'],
                description: 'Custom tags for bookmark organization',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2025-01-15T14:30:00.000Z',
                description: 'When bookmark was created',
              },
            },
          },
          {
            type: 'null',
            description: 'Null if user is not authenticated or has not bookmarked this post',
          },
        ],
      },
    },
  },

  // ==================== POST REACTION SCHEMAS ====================

  PostReactionRequest: {
    type: 'object',
    required: ['reactionType'],
    properties: {
      reactionType: {
        type: 'string',
        enum: ['LIKE', 'HELPFUL', 'LOVE', 'INSIGHTFUL', 'AMAZING'],
        example: 'LIKE',
        description: 'Type of reaction',
      },
    },
  },

  PostReactionResponse: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 'clreact123abc',
        description: 'Reaction ID',
      },
      postId: {
        type: 'string',
        example: 'clpost123abc',
        description: 'Post ID',
      },
      userId: {
        type: 'string',
        nullable: true,
        example: 'cluser123abc',
        description: 'User ID (null for guest reactions)',
      },
      reactionType: {
        type: 'string',
        enum: ['LIKE', 'HELPFUL', 'LOVE', 'INSIGHTFUL', 'AMAZING'],
        example: 'LIKE',
        description: 'Type of reaction',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-20T14:30:00.000Z',
        description: 'Reaction creation timestamp',
      },
      user: {
        type: 'object',
        nullable: true,
        properties: {
          id: { type: 'string', example: 'cluser123abc' },
          username: { type: 'string', example: 'johndoe' },
          name: { type: 'string', nullable: true, example: 'John Doe' },
          avatarUrl: {
            type: 'string',
            nullable: true,
            example: 'https://api.example.com/uploads/avatars/user123.webp',
          },
        },
      },
    },
  },

  PostReactionsSummary: {
    type: 'object',
    properties: {
      postId: {
        type: 'string',
        example: 'clpost123abc',
        description: 'Post ID',
      },
      totalReactions: {
        type: 'integer',
        example: 145,
        description: 'Total number of reactions',
      },
      likeCount: {
        type: 'integer',
        example: 85,
        description: 'Number of LIKE reactions',
      },
      helpfulCount: {
        type: 'integer',
        example: 30,
        description: 'Number of HELPFUL reactions',
      },
      loveCount: {
        type: 'integer',
        example: 20,
        description: 'Number of LOVE reactions',
      },
      insightfulCount: {
        type: 'integer',
        example: 8,
        description: 'Number of INSIGHTFUL reactions',
      },
      amazingCount: {
        type: 'integer',
        example: 2,
        description: 'Number of AMAZING reactions',
      },
      userReactions: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['LIKE', 'HELPFUL', 'LOVE', 'INSIGHTFUL', 'AMAZING'],
        },
        nullable: true,
        example: ['LIKE', 'HELPFUL'],
        description: 'Reactions from current user (if authenticated)',
      },
    },
  },

  AddOrToggleReactionResponse: {
    type: 'object',
    properties: {
      reaction: {
        oneOf: [
          { $ref: '#/components/schemas/PostReactionResponse' },
          { type: 'null' },
        ],
        description: 'Reaction object if added, null if removed',
      },
      action: {
        type: 'string',
        enum: ['added', 'removed'],
        example: 'added',
        description: 'Action performed (added or removed)',
      },
    },
  },
};

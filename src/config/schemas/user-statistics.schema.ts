/**
 * User Statistics Schemas
 * OpenAPI schema definitions for user statistics
 */

export const userStatisticsSchemas = {
  // ==================== DATA SCHEMAS ====================

  UserStatisticsProfile: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'cluser123abc456' },
      username: { type: 'string', example: 'liupurnomo' },
      name: { type: 'string', nullable: true, example: 'Liu Purnomo' },
      avatarUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://server.liupurnomo.com/uploads/avatars/abc123-medium.webp',
      },
      bio: { type: 'string', nullable: true, example: 'Full-stack developer passionate about TypeScript' },
      location: { type: 'string', nullable: true, example: 'Jakarta, Indonesia' },
      createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
    },
    description: 'Public user profile (role is excluded for privacy)',
  },

  UserStatisticsMetrics: {
    type: 'object',
    properties: {
      totalPosts: { type: 'integer', example: 42 },
      totalPublishedPosts: { type: 'integer', example: 38 },
      totalViews: { type: 'integer', example: 15420 },
      totalComments: { type: 'integer', example: 234 },
      totalReactions: { type: 'integer', example: 567 },
      joinedDaysAgo: { type: 'integer', example: 305 },
    },
  },

  UserStatisticsTopPost: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clpost123abc456' },
      title: { type: 'string', example: 'Getting Started with TypeScript' },
      slug: { type: 'string', example: 'getting-started-with-typescript' },
      viewCount: { type: 'integer', example: 1523 },
      publishedAt: { type: 'string', format: 'date-time', nullable: true, example: '2024-11-01T08:00:00Z' },
    },
  },

  UserStatisticsRecentPost: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clpost456def789' },
      title: { type: 'string', example: 'Advanced React Patterns' },
      slug: { type: 'string', example: 'advanced-react-patterns' },
      excerpt: { type: 'string', nullable: true, example: 'Learn advanced React patterns for better code organization' },
      featuredImageUrl: {
        type: 'string',
        format: 'uri',
        nullable: true,
        example: 'https://server.liupurnomo.com/uploads/featured/react-patterns.jpg',
      },
      publishedAt: { type: 'string', format: 'date-time', nullable: true, example: '2024-11-14T10:00:00Z' },
    },
  },

  // ==================== RESPONSE SCHEMAS ====================

  UserStatisticsData: {
    type: 'object',
    properties: {
      user: { $ref: '#/components/schemas/UserStatisticsProfile' },
      statistics: { $ref: '#/components/schemas/UserStatisticsMetrics' },
      topPosts: {
        type: 'array',
        items: { $ref: '#/components/schemas/UserStatisticsTopPost' },
        description: 'Top 5 posts by view count',
      },
      recentPosts: {
        type: 'array',
        items: { $ref: '#/components/schemas/UserStatisticsRecentPost' },
        description: '5 most recent published posts',
      },
    },
  },

  UserStatisticsResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'User statistics retrieved successfully' },
      data: { $ref: '#/components/schemas/UserStatisticsData' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },
};

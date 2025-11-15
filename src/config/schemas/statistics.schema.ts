/**
 * Statistics Schemas
 * OpenAPI schema definitions for blog statistics
 */

export const statisticsSchemas = {
  // ==================== RESPONSE SCHEMAS ====================

  TopPost: {
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clpost123abc456' },
      title: { type: 'string', example: 'Getting Started with TypeScript' },
      slug: { type: 'string', example: 'getting-started-with-typescript' },
      featuredImageUrl: {
        type: 'string',
        nullable: true,
        example: 'https://example.com/images/typescript.jpg',
      },
      viewCount: { type: 'number', example: 1250 },
      publishedAt: {
        type: 'string',
        format: 'date-time',
        nullable: true,
        example: '2025-01-10T10:30:00Z',
      },
      interactionCount: { type: 'number', example: 85 },
      commentCount: { type: 'number', example: 25 },
      reactionCount: { type: 'number', example: 60 },
      likeCount: { type: 'number', example: 30 },
    },
  },

  StatisticsOverview: {
    type: 'object',
    properties: {
      totalPosts: { type: 'number', example: 150 },
      totalPublishedPosts: { type: 'number', example: 120 },
      totalDraftPosts: { type: 'number', example: 30 },
      totalViews: { type: 'number', example: 45000 },
      totalComments: { type: 'number', example: 850 },
      totalApprovedComments: { type: 'number', example: 800 },
      totalReactions: { type: 'number', example: 3200 },
      totalBookmarks: { type: 'number', example: 1500 },
      totalUsers: { type: 'number', example: 2500 },
      totalCategories: { type: 'number', example: 12 },
      totalTags: { type: 'number', example: 45 },
    },
  },

  TopPosts: {
    type: 'object',
    properties: {
      byViews: {
        type: 'array',
        items: { $ref: '#/components/schemas/TopPost' },
        description: 'Top 5 posts by view count',
      },
      byInteractions: {
        type: 'array',
        items: { $ref: '#/components/schemas/TopPost' },
        description: 'Top 5 posts by total interactions (comments + reactions)',
      },
      recent: {
        type: 'array',
        items: { $ref: '#/components/schemas/TopPost' },
        description: 'Most recent 5 published posts',
      },
    },
  },

  RecentActivity: {
    type: 'object',
    properties: {
      commentsLast7Days: {
        type: 'number',
        example: 45,
        description: 'Comments created in last 7 days',
      },
      reactionsLast7Days: {
        type: 'number',
        example: 180,
        description: 'Reactions added in last 7 days',
      },
      bookmarksLast7Days: {
        type: 'number',
        example: 95,
        description: 'Bookmarks created in last 7 days',
      },
      viewsLast7Days: {
        type: 'number',
        example: 3200,
        description: 'Post views in last 7 days',
      },
    },
  },

  ReactionBreakdown: {
    type: 'object',
    properties: {
      postReactions: {
        type: 'object',
        properties: {
          like: { type: 'number', example: 1200 },
          helpful: { type: 'number', example: 350 },
          love: { type: 'number', example: 800 },
          insightful: { type: 'number', example: 450 },
          amazing: { type: 'number', example: 250 },
          total: { type: 'number', example: 3050 },
        },
      },
      commentReactions: {
        type: 'object',
        properties: {
          like: { type: 'number', example: 550 },
          helpful: { type: 'number', example: 200 },
          total: { type: 'number', example: 750 },
        },
      },
    },
  },

  StatisticsData: {
    type: 'object',
    properties: {
      overview: { $ref: '#/components/schemas/StatisticsOverview' },
      topPosts: { $ref: '#/components/schemas/TopPosts' },
      recentActivity: { $ref: '#/components/schemas/RecentActivity' },
      reactionBreakdown: { $ref: '#/components/schemas/ReactionBreakdown' },
    },
  },

  StatisticsResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Blog statistics retrieved successfully' },
      data: { $ref: '#/components/schemas/StatisticsData' },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' },
    },
  },
};

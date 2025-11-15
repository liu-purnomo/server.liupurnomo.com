/**
 * Statistics API Documentation
 * OpenAPI paths for statistics endpoints
 */

export const statisticsPaths = {
  '/api/statistics': {
    get: {
      tags: ['Statistics'],
      summary: 'Get comprehensive blog statistics',
      description: `Get complete blog statistics for dashboard including:
- Overview metrics (posts, views, comments, reactions, bookmarks, users)
- Top posts by views and interactions
- Recent activity (last 7 days)
- Reaction breakdown by type

**Admin only** - Requires authentication with ADMIN role.`,
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Blog statistics retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StatisticsResponse' },
            },
          },
        },
        401: { $ref: '#/components/responses/Unauthorized' },
        403: { $ref: '#/components/responses/Forbidden' },
      },
    },
  },
};

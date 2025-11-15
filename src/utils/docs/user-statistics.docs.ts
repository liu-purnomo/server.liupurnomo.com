/**
 * User Statistics API Documentation
 * OpenAPI paths for user statistics endpoints
 */

export const userStatisticsPaths = {
  '/api/users/@{username}/statistics': {
    get: {
      tags: ['Users'],
      summary: 'Get public user statistics by username',
      description: `Get comprehensive public statistics for a user profile.

Returns:
- User profile information (id, username, name, avatarUrl, bio, location, createdAt)
- Statistics metrics:
  - Total posts count
  - Total published posts count
  - Total views across all posts
  - Total comments on user's posts
  - Total reactions (on posts and comments)
  - Days since user joined
- Top 5 posts by view count
- 5 most recent published posts

This endpoint is public and does not require authentication.`,
      parameters: [
        {
          name: 'username',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Username (without @ prefix)',
          example: 'liupurnomo',
        },
      ],
      responses: {
        200: {
          description: 'User statistics retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UserStatisticsResponse' },
            },
          },
        },
        404: {
          description: 'User not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        422: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
            },
          },
        },
      },
    },
  },
};

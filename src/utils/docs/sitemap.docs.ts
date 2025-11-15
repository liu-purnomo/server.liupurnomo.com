/**
 * Sitemap API Documentation
 * OpenAPI paths for sitemap endpoints
 */

export const sitemapPaths = {
  '/api/sitemap': {
    get: {
      tags: ['Sitemap'],
      summary: 'Get sitemap data',
      description: `Get all public content for sitemap.xml generation.

Returns:
- All published posts with slug, updatedAt, publishedAt
- All categories with slug, updatedAt
- All tags with slug, updatedAt
- All media files with fileUrl, updatedAt
- All public events (UPCOMING, ONGOING, COMPLETED) with slug, updatedAt, eventDate

This endpoint is public and does not require authentication.`,
      responses: {
        200: {
          description: 'Sitemap data retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SitemapResponse' },
            },
          },
        },
      },
    },
  },
};

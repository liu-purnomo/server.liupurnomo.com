/**
 * Sitemap Service
 * Provides data for sitemap.xml generation
 */

import { prisma } from '../lib/prisma.js';

export interface SitemapPost {
  slug: string;
  title: string;
  updatedAt: Date;
  publishedAt: Date | null;
}

export interface SitemapCategory {
  slug: string;
  name: string;
  updatedAt: Date;
}

export interface SitemapTag {
  slug: string;
  name: string;
  updatedAt: Date;
}

export interface SitemapMedia {
  fileUrl: string;
  fileName: string;
  updatedAt: Date;
}

export interface SitemapEvent {
  slug: string;
  title: string;
  updatedAt: Date;
  eventDate: Date;
}

export interface SitemapData {
  posts: SitemapPost[];
  categories: SitemapCategory[];
  tags: SitemapTag[];
  media: SitemapMedia[];
  events: SitemapEvent[];
}

/**
 * Get all published content for sitemap
 */
export async function getSitemapData(): Promise<SitemapData> {
  const [posts, categories, tags, media, events] = await Promise.all([
    // Get all published posts
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        slug: true,
        title: true,

        updatedAt: true,
        publishedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),

    // Get all categories
    prisma.category.findMany({
      select: {
        slug: true,
        name: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),

    // Get all tags
    prisma.tag.findMany({
      select: {
        slug: true,
        name: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),

    // Get all media files
    prisma.media.findMany({
      select: {
        fileUrl: true,
        fileName: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    }),

    // Get all public events (UPCOMING, ONGOING, COMPLETED)
    prisma.event.findMany({
      where: {
        status: {
          in: ['UPCOMING', 'ONGOING', 'COMPLETED'],
        },
      },
      select: {
        slug: true,
        title: true,
        updatedAt: true,
        eventDate: true,
      },
      orderBy: {
        eventDate: 'desc',
      },
    }),
  ]);

  return {
    posts,
    categories,
    tags,
    media,
    events,
  };
}

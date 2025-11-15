/**
 * User Statistics Service
 * Public user statistics for profile pages
 */

import { prisma } from '../lib/prisma.js';
import { NotFoundError } from '../utils/errors.js';

export interface UserStatistics {
  user: {
    id: string;
    username: string;
    name: string | null;
    avatarUrl: string | null;
    bio: string | null;
    location: string | null;
    createdAt: Date;
  };
  statistics: {
    totalPosts: number;
    totalPublishedPosts: number;
    totalViews: number;
    totalComments: number;
    totalReactions: number;
    joinedDaysAgo: number;
  };
  topPosts: Array<{
    id: string;
    title: string;
    slug: string;
    viewCount: number;
    publishedAt: Date | null;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    featuredImageUrl: string | null;
    publishedAt: Date | null;
  }>;
}

/**
 * Get public user statistics by username
 */
export async function getUserStatisticsByUsername(
  username: string
): Promise<UserStatistics> {
  // Get user
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      name: true,
      avatarUrl: true,
      bio: true,
      location: true,
      createdAt: true,
      isActive: true,
    },
  });

  if (!user || !user.isActive) {
    throw new NotFoundError('User not found');
  }

  // Calculate days since joined
  const joinedDaysAgo = Math.floor(
    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Get statistics
  const [
    totalPosts,
    totalPublishedPosts,
    totalViews,
    totalComments,
    totalPostReactions,
    totalCommentReactions,
    topPosts,
    recentPosts,
  ] = await Promise.all([
    // Total posts by user
    prisma.post.count({
      where: {
        authorId: user.id,
        deletedAt: null,
      },
    }),

    // Total published posts
    prisma.post.count({
      where: {
        authorId: user.id,
        status: 'PUBLISHED',
        deletedAt: null,
      },
    }),

    // Total views across all user's posts
    prisma.post.aggregate({
      where: {
        authorId: user.id,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      _sum: {
        viewCount: true,
      },
    }),

    // Total comments on user's posts
    prisma.comment.count({
      where: {
        post: {
          authorId: user.id,
          deletedAt: null,
        },
        deletedAt: null,
      },
    }),

    // Total reactions on user's posts
    prisma.postReaction.count({
      where: {
        post: {
          authorId: user.id,
          deletedAt: null,
        },
      },
    }),

    // Total reactions on user's comments
    prisma.commentReaction.count({
      where: {
        comment: {
          userId: user.id,
          deletedAt: null,
        },
      },
    }),

    // Top 5 posts by views
    prisma.post.findMany({
      where: {
        authorId: user.id,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: 5,
    }),

    // Recent 5 posts
    prisma.post.findMany({
      where: {
        authorId: user.id,
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImageUrl: true,
        publishedAt: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 5,
    }),
  ]);

  return {
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      location: user.location,
      createdAt: user.createdAt,
    },
    statistics: {
      totalPosts,
      totalPublishedPosts,
      totalViews: totalViews._sum.viewCount || 0,
      totalComments,
      totalReactions: totalPostReactions + totalCommentReactions,
      joinedDaysAgo,
    },
    topPosts,
    recentPosts,
  };
}

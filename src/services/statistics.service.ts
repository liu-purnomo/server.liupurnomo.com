/**
 * Statistics Service
 * Provides comprehensive blog statistics for dashboard
 */

import { prisma } from '../lib/prisma.js';
import { ApiResponse } from '../types/response.types.js';

interface TopPost {
  id: string;
  title: string;
  slug: string;
  featuredImageUrl: string | null;
  viewCount: number;
  publishedAt: Date | null;
  interactionCount?: number;
  likeCount?: number;
  commentCount?: number;
  reactionCount?: number;
}

interface RecentActivity {
  commentsLast7Days: number;
  reactionsLast7Days: number;
  bookmarksLast7Days: number;
  viewsLast7Days: number;
}

interface StatisticsData {
  overview: {
    totalPosts: number;
    totalPublishedPosts: number;
    totalDraftPosts: number;
    totalViews: number;
    totalComments: number;
    totalApprovedComments: number;
    totalReactions: number;
    totalBookmarks: number;
    totalUsers: number;
    totalCategories: number;
    totalTags: number;
  };
  topPosts: {
    byViews: TopPost[];
    byInteractions: TopPost[];
    recent: TopPost[];
  };
  recentActivity: RecentActivity;
  reactionBreakdown: {
    postReactions: {
      like: number;
      helpful: number;
      love: number;
      insightful: number;
      amazing: number;
      total: number;
    };
    commentReactions: {
      like: number;
      helpful: number;
      total: number;
    };
  };
}

/**
 * Get comprehensive blog statistics
 * Returns overview, top posts, recent activity, and engagement metrics
 */
export async function getBlogStatistics(): Promise<
  ApiResponse<StatisticsData>
> {
  // Calculate date 7 days ago for recent activity
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Parallel execution for performance
  const [
    // Overview counts
    totalPosts,
    totalPublishedPosts,
    totalDraftPosts,
    totalViews,
    totalComments,
    totalApprovedComments,
    totalPostReactions,
    totalCommentReactions,
    totalBookmarks,
    totalUsers,
    totalCategories,
    totalTags,

    // Top posts by views
    topPostsByViews,

    // Top posts by interactions (need to calculate)
    postsWithInteractions,

    // Recent posts
    recentPosts,

    // Recent activity
    commentsLast7Days,
    reactionsLast7Days,
    bookmarksLast7Days,
    viewsLast7Days,

    // Reaction breakdown
    postReactionsByType,
    commentReactionsByType,
  ] = await Promise.all([
    // Overview counts
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED', deletedAt: null } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
    prisma.postView.count(),
    prisma.comment.count({ where: { deletedAt: null } }),
    prisma.comment.count({ where: { isApproved: true, deletedAt: null } }),
    prisma.postReaction.count(),
    prisma.commentReaction.count(),
    prisma.bookmark.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.tag.count(),

    // Top posts by views (limit 5)
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImageUrl: true,
        viewCount: true,
        publishedAt: true,
      },
      orderBy: { viewCount: 'desc' },
      take: 5,
    }),

    // Get posts with interaction counts for top posts by interactions
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImageUrl: true,
        viewCount: true,
        publishedAt: true,
        likeCount: true,
        helpfulCount: true,
        loveCount: true,
        insightfulCount: true,
        amazingCount: true,
        _count: {
          select: {
            comments: {
              where: { isApproved: true, deletedAt: null },
            },
          },
        },
      },
      take: 20, // Get more to sort by interaction
    }),

    // Recent posts (limit 5)
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImageUrl: true,
        viewCount: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    }),

    // Recent activity - last 7 days
    prisma.comment.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        deletedAt: null,
      },
    }),
    prisma.postReaction.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.bookmark.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.postView.count({
      where: {
        viewedAt: { gte: sevenDaysAgo },
      },
    }),

    // Reaction breakdown by type
    prisma.postReaction.groupBy({
      by: ['reactionType'],
      _count: true,
    }),
    prisma.commentReaction.groupBy({
      by: ['reactionType'],
      _count: true,
    }),
  ]);

  // Calculate top posts by interactions
  const postsWithInteractionScores = postsWithInteractions.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    featuredImageUrl: post.featuredImageUrl,
    viewCount: post.viewCount,
    publishedAt: post.publishedAt,
    commentCount: post._count.comments,
    reactionCount:
      post.likeCount +
      post.helpfulCount +
      post.loveCount +
      post.insightfulCount +
      post.amazingCount,
    interactionCount:
      post._count.comments +
      post.likeCount +
      post.helpfulCount +
      post.loveCount +
      post.insightfulCount +
      post.amazingCount,
  }));

  // Sort by interaction count and take top 5
  const topPostsByInteractions = postsWithInteractionScores
    .sort((a, b) => b.interactionCount - a.interactionCount)
    .slice(0, 5);

  // Build reaction breakdown
  const postReactionBreakdown = {
    like: 0,
    helpful: 0,
    love: 0,
    insightful: 0,
    amazing: 0,
    total: totalPostReactions,
  };

  postReactionsByType.forEach((item) => {
    const type = item.reactionType.toLowerCase() as keyof typeof postReactionBreakdown;
    if (type !== 'total') {
      postReactionBreakdown[type] = item._count;
    }
  });

  const commentReactionBreakdown = {
    like: 0,
    helpful: 0,
    total: totalCommentReactions,
  };

  commentReactionsByType.forEach((item) => {
    const type = item.reactionType.toLowerCase() as 'like' | 'helpful';
    commentReactionBreakdown[type] = item._count;
  });

  return {
    success: true,
    message: 'Blog statistics retrieved successfully',
    data: {
      overview: {
        totalPosts,
        totalPublishedPosts,
        totalDraftPosts,
        totalViews,
        totalComments,
        totalApprovedComments,
        totalReactions: totalPostReactions + totalCommentReactions,
        totalBookmarks,
        totalUsers,
        totalCategories,
        totalTags,
      },
      topPosts: {
        byViews: topPostsByViews,
        byInteractions: topPostsByInteractions,
        recent: recentPosts,
      },
      recentActivity: {
        commentsLast7Days,
        reactionsLast7Days,
        bookmarksLast7Days,
        viewsLast7Days,
      },
      reactionBreakdown: {
        postReactions: postReactionBreakdown,
        commentReactions: commentReactionBreakdown,
      },
    },
  };
}

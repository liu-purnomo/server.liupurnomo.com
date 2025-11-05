/**
 * Post Reaction Service
 * Handles post-level reactions (like, love, helpful, etc.)
 */

import { ReactionType } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import {
  PostReactionResponse,
  PostReactionsSummary,
} from '../types/post.types.js';
import { ApiResponse } from '../types/response.types.js';
import { AppError } from '../utils/errors.js';

/**
 * Add or toggle reaction to a post
 * If user already has this reaction type, remove it (toggle off)
 * If user has different reaction type, switch to new type
 * Automatically updates denormalized counts on Post model
 */
export async function addOrToggleReaction(
  postId: string,
  reactionType: ReactionType,
  userId?: string,
  ipAddress?: string,
  userAgent?: string
): Promise<
  ApiResponse<{
    reaction: PostReactionResponse | null;
    action: 'added' | 'removed';
  }>
> {
  // Verify post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, status: true, deletedAt: true },
  });

  if (!post || post.deletedAt) {
    throw new AppError('Post not found', 404);
  }

  if (post.status !== 'PUBLISHED') {
    throw new AppError('Cannot react to unpublished post', 403);
  }

  // Check if user already has this exact reaction
  const existingReaction = await prisma.postReaction.findFirst({
    where: userId
      ? {
          postId,
          userId,
          reactionType,
        }
      : {
          postId,
          ipAddress,
          reactionType,
        },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  // If exact reaction exists, remove it (toggle off)
  if (existingReaction) {
    await prisma.$transaction(async (tx) => {
      // Delete the reaction
      await tx.postReaction.delete({
        where: { id: existingReaction.id },
      });

      // Decrement the appropriate count on Post
      const countField = `${reactionType.toLowerCase()}Count` as
        | 'likeCount'
        | 'helpfulCount'
        | 'loveCount'
        | 'insightfulCount'
        | 'amazingCount';

      await tx.post.update({
        where: { id: postId },
        data: {
          [countField]: {
            decrement: 1,
          },
        },
      });
    });

    return {
      success: true,
      message: 'Reaction removed successfully',
      data: {
        reaction: null,
        action: 'removed',
      },
    };
  }

  // Check if user has a different reaction type on this post
  const otherReaction = await prisma.postReaction.findFirst({
    where: userId
      ? {
          postId,
          userId,
          reactionType: { not: reactionType },
        }
      : {
          postId,
          ipAddress,
          reactionType: { not: reactionType },
        },
  });

  // If user has different reaction, switch to new one
  if (otherReaction) {
    const newReaction = await prisma.$transaction(async (tx) => {
      const oldReactionType = otherReaction.reactionType;

      // Delete old reaction
      await tx.postReaction.delete({
        where: { id: otherReaction.id },
      });

      // Create new reaction
      const created = await tx.postReaction.create({
        data: {
          postId,
          userId,
          reactionType,
          ipAddress,
          userAgent,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Update counts: decrement old, increment new
      const oldCountField = `${oldReactionType.toLowerCase()}Count` as
        | 'likeCount'
        | 'helpfulCount'
        | 'loveCount'
        | 'insightfulCount'
        | 'amazingCount';

      const newCountField = `${reactionType.toLowerCase()}Count` as
        | 'likeCount'
        | 'helpfulCount'
        | 'loveCount'
        | 'insightfulCount'
        | 'amazingCount';

      await tx.post.update({
        where: { id: postId },
        data: {
          [oldCountField]: { decrement: 1 },
          [newCountField]: { increment: 1 },
        },
      });

      return created;
    });

    return {
      success: true,
      message: 'Reaction updated successfully',
      data: {
        reaction: newReaction,
        action: 'added',
      },
    };
  }

  // No existing reaction, create new one
  const newReaction = await prisma.$transaction(async (tx) => {
    const created = await tx.postReaction.create({
      data: {
        postId,
        userId,
        reactionType,
        ipAddress,
        userAgent,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Increment the appropriate count on Post
    const countField = `${reactionType.toLowerCase()}Count` as
      | 'likeCount'
      | 'helpfulCount'
      | 'loveCount'
      | 'insightfulCount'
      | 'amazingCount';

    await tx.post.update({
      where: { id: postId },
      data: {
        [countField]: {
          increment: 1,
        },
      },
    });

    return created;
  });

  return {
    success: true,
    message: 'Reaction added successfully',
    data: {
      reaction: newReaction,
      action: 'added',
    },
  };
}

/**
 * Get reactions summary for a post
 * Includes total counts and optionally current user's reactions
 */
export async function getPostReactionsSummary(
  postId: string,
  userId?: string,
  ipAddress?: string
): Promise<ApiResponse<PostReactionsSummary>> {
  // Get post with denormalized counts
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      likeCount: true,
      helpfulCount: true,
      loveCount: true,
      insightfulCount: true,
      amazingCount: true,
    },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Get user's reactions if authenticated or guest
  let userReactions: ReactionType[] = [];
  if (userId || ipAddress) {
    const reactions = await prisma.postReaction.findMany({
      where: userId ? { postId, userId } : { postId, ipAddress },
      select: { reactionType: true },
    });

    userReactions = reactions.map((r) => r.reactionType);
  }

  const totalReactions =
    post.likeCount +
    post.helpfulCount +
    post.loveCount +
    post.insightfulCount +
    post.amazingCount;

  return {
    success: true,
    message: 'Post reactions summary retrieved successfully',
    data: {
      postId: post.id,
      totalReactions,
      likeCount: post.likeCount,
      helpfulCount: post.helpfulCount,
      loveCount: post.loveCount,
      insightfulCount: post.insightfulCount,
      amazingCount: post.amazingCount,
      userReactions: userReactions.length > 0 ? userReactions : undefined,
    },
  };
}

/**
 * Get all reactions for a post (with pagination)
 * For displaying who reacted to a post
 */
export async function getPostReactions(
  postId: string,
  reactionType?: ReactionType,
  page = 1,
  limit = 20
): Promise<
  ApiResponse<{
    reactions: PostReactionResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>
> {
  const skip = (page - 1) * limit;

  const where = {
    postId,
    ...(reactionType && { reactionType }),
  };

  const [reactions, total] = await Promise.all([
    prisma.postReaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.postReaction.count({ where }),
  ]);

  return {
    success: true,
    message: 'Post reactions retrieved successfully',
    data: {
      reactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
}

/**
 * Remove user's reaction from a post
 * Used for explicit removal (not toggle)
 */
export async function removeReaction(
  postId: string,
  reactionType: ReactionType,
  userId?: string,
  ipAddress?: string
): Promise<ApiResponse<null>> {
  const reaction = await prisma.postReaction.findFirst({
    where: userId
      ? { postId, userId, reactionType }
      : { postId, ipAddress, reactionType },
  });

  if (!reaction) {
    throw new AppError('Reaction not found', 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.postReaction.delete({
      where: { id: reaction.id },
    });

    // Decrement the appropriate count on Post
    const countField = `${reactionType.toLowerCase()}Count` as
      | 'likeCount'
      | 'helpfulCount'
      | 'loveCount'
      | 'insightfulCount'
      | 'amazingCount';

    await tx.post.update({
      where: { id: postId },
      data: {
        [countField]: {
          decrement: 1,
        },
      },
    });
  });

  return {
    success: true,
    message: 'Reaction removed successfully',
    data: null,
  };
}

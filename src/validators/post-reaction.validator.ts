import { z } from 'zod';
import { ReactionType } from '@prisma/client';

/**
 * Post Reaction Validators
 * NO wrapper objects - middleware handles req[source] extraction
 */

// ==================== GET USER REACTIONS ====================

export const getUserReactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(20),

  reactionType: z
    .enum([
      ReactionType.LIKE,
      ReactionType.HELPFUL,
      ReactionType.LOVE,
      ReactionType.INSIGHTFUL,
      ReactionType.AMAZING,
    ])
    .optional(),

  sortBy: z.enum(['createdAt']).default('createdAt'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type GetUserReactionsQueryInput = z.infer<
  typeof getUserReactionsQuerySchema
>;

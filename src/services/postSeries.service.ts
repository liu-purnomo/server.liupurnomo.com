/**
 * Post Series Service
 * Business logic for tutorial series management
 */

import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/errors.js';

interface GetAllPostSeriesParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: 'title' | 'orderPosition' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

interface CreatePostSeriesData {
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  orderPosition?: number;
}

interface UpdatePostSeriesData {
  title?: string;
  slug?: string;
  description?: string;
  thumbnailUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  orderPosition?: number;
}

/**
 * Get All Post Series with Pagination
 */
export async function getAllPostSeries(params: GetAllPostSeriesParams) {
  const {
    page,
    limit,
    search,
    sortBy = 'orderPosition',
    sortOrder = 'asc',
  } = params;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Get total count
  const total = await prisma.postSeries.count({ where });

  // Get series with item count
  const series = await prisma.postSeries.findMany({
    where,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    include: {
      _count: {
        select: { postSeriesItems: true },
      },
    },
  });

  const data = series.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description,
    thumbnailUrl: s.thumbnailUrl,
    orderPosition: s.orderPosition,
    createdAt: s.createdAt,
    itemCount: s._count.postSeriesItems,
  }));

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get Post Series by ID
 */
export async function getPostSeriesById(id: string) {
  const series = await prisma.postSeries.findUnique({
    where: { id },
    include: {
      postSeriesItems: {
        orderBy: { orderPosition: 'asc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              featuredImageUrl: true,
              publishedAt: true,
            },
          },
        },
      },
    },
  });

  if (!series) {
    throw new AppError('Post series not found', 404);
  }

  return series;
}

/**
 * Get Post Series by Slug
 */
export async function getPostSeriesBySlug(slug: string) {
  const series = await prisma.postSeries.findUnique({
    where: { slug },
    include: {
      postSeriesItems: {
        orderBy: { orderPosition: 'asc' },
        include: {
          post: {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              featuredImageUrl: true,
              publishedAt: true,
            },
          },
        },
      },
    },
  });

  if (!series) {
    throw new AppError('Post series not found', 404);
  }

  return series;
}

/**
 * Create Post Series
 */
export async function createPostSeries(data: CreatePostSeriesData) {
  // Check if slug already exists
  const existingSeries = await prisma.postSeries.findUnique({
    where: { slug: data.slug },
  });

  if (existingSeries) {
    throw new AppError('Series with this slug already exists', 409);
  }

  const series = await prisma.postSeries.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      orderPosition: data.orderPosition ?? 0,
    },
  });

  return series;
}

/**
 * Update Post Series
 */
export async function updatePostSeries(id: string, data: UpdatePostSeriesData) {
  // Check if series exists
  const existingSeries = await prisma.postSeries.findUnique({
    where: { id },
  });

  if (!existingSeries) {
    throw new AppError('Post series not found', 404);
  }

  // Check if slug is being changed and if it already exists
  if (data.slug && data.slug !== existingSeries.slug) {
    const slugExists = await prisma.postSeries.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists) {
      throw new AppError('Series with this slug already exists', 409);
    }
  }

  const series = await prisma.postSeries.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.slug && { slug: data.slug }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.thumbnailUrl !== undefined && {
        thumbnailUrl: data.thumbnailUrl,
      }),
      ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
      ...(data.metaDescription !== undefined && {
        metaDescription: data.metaDescription,
      }),
      ...(data.orderPosition !== undefined && {
        orderPosition: data.orderPosition,
      }),
    },
  });

  return series;
}

/**
 * Delete Post Series
 */
export async function deletePostSeries(id: string) {
  const series = await prisma.postSeries.findUnique({
    where: { id },
  });

  if (!series) {
    throw new AppError('Post series not found', 404);
  }

  await prisma.postSeries.delete({
    where: { id },
  });
}

/**
 * Add Post to Series
 */
export async function addPostToSeries(
  seriesId: string,
  postId: string,
  orderPosition: number
) {
  // Check if series exists
  const series = await prisma.postSeries.findUnique({
    where: { id: seriesId },
  });

  if (!series) {
    throw new AppError('Post series not found', 404);
  }

  // Check if post exists
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check if post is already in series
  const existing = await prisma.postSeriesItem.findUnique({
    where: {
      seriesId_postId: {
        seriesId,
        postId,
      },
    },
  });

  if (existing) {
    throw new AppError('Post is already in this series', 409);
  }

  const item = await prisma.postSeriesItem.create({
    data: {
      seriesId,
      postId,
      orderPosition,
    },
  });

  return item;
}

/**
 * Remove Post from Series
 */
export async function removePostFromSeries(seriesId: string, postId: string) {
  const item = await prisma.postSeriesItem.findUnique({
    where: {
      seriesId_postId: {
        seriesId,
        postId,
      },
    },
  });

  if (!item) {
    throw new AppError('Post is not in this series', 404);
  }

  await prisma.postSeriesItem.delete({
    where: {
      seriesId_postId: {
        seriesId,
        postId,
      },
    },
  });
}

import { EventStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import type {
  CreateEventRequest,
  EventListItemResponse,
  EventQueryParams,
  EventResponse,
  UpdateEventRequest,
} from '../types/index.js';
import type { ApiResponse, PaginatedResult } from '../types/response.types.js';
import {
  ConflictError,
  NotFoundError,
  calculatePagination,
} from '../utils/index.js';

/**
 * Helper function to transform Event to EventResponse
 */
function toEventResponse(event: any): EventResponse {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    content: event.content,
    eventType: event.eventType,
    status: event.status,
    locationType: event.locationType,

    eventDate: event.eventDate.toISOString(),
    startTime: event.startTime,
    endTime: event.endTime,
    timezone: event.timezone,

    venue: event.venue,
    address: event.address,
    city: event.city,
    country: event.country,
    mapUrl: event.mapUrl,

    platformName: event.platformName,
    platformUrl: event.platformUrl,

    organizerName: event.organizerName,
    organizerUrl: event.organizerUrl,

    role: event.role,
    topics: event.topics,
    participants: event.participants,

    featuredImageUrl: event.featuredImageUrl,
    galleryImages: event.galleryImages,

    metaTitle: event.metaTitle,
    metaDescription: event.metaDescription,
    metaKeywords: event.metaKeywords,
    ogImageUrl: event.ogImageUrl,
    canonicalUrl: event.canonicalUrl,

    viewCount: event.viewCount,

    publishedAt: event.publishedAt?.toISOString() || null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

/**
 * Helper function to transform Event to EventListItemResponse
 */
function toEventListItemResponse(event: any): EventListItemResponse {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description,
    eventType: event.eventType,
    status: event.status,
    locationType: event.locationType,
    organizerName: event.organizerName,

    eventDate: event.eventDate.toISOString(),
    city: event.city,
    country: event.country,
    venue: event.venue,

    role: event.role,
    topics: event.topics,
    participants: event.participants,

    featuredImageUrl: event.featuredImageUrl,

    viewCount: event.viewCount,

    publishedAt: event.publishedAt?.toISOString() || null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  };
}

/**
 * Create Event
 */
export async function createEvent(
  data: CreateEventRequest,
): Promise<ApiResponse<EventResponse>> {
  // Check if slug already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: data.slug },
  });

  if (existingEvent) {
    throw new ConflictError(`Event with slug '${data.slug}' already exists`);
  }

  // Handle publishedAt based on status
  let publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  if (
    data.status === EventStatus.UPCOMING ||
    data.status === EventStatus.ONGOING ||
    data.status === EventStatus.COMPLETED
  ) {
    publishedAt = publishedAt || new Date();
  }

  // Create event
  const event = await prisma.event.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content || null,
      eventType: data.eventType,
      status: data.status || EventStatus.DRAFT,
      locationType: data.locationType,

      eventDate: new Date(data.eventDate),
      startTime: data.startTime,
      endTime: data.endTime,
      timezone: data.timezone || 'Asia/Jakarta',

      venue: data.venue,
      address: data.address,
      city: data.city,
      country: data.country || 'Indonesia',
      mapUrl: data.mapUrl,

      platformName: data.platformName,
      platformUrl: data.platformUrl,

      organizerName: data.organizerName,
      organizerUrl: data.organizerUrl,

      role: data.role,
      topics: data.topics || [],
      participants: data.participants,

      featuredImageUrl: data.featuredImageUrl,
      galleryImages: data.galleryImages || [],

      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords || [],
      ogImageUrl: data.ogImageUrl,
      canonicalUrl: data.canonicalUrl,

      publishedAt,
    },
  });

  return {
    success: true,
    message: 'Event created successfully',
    data: toEventResponse(event),
  };
}

/**
 * Get Event by ID
 */
export async function getEventById(
  eventId: string,
): Promise<ApiResponse<EventResponse>> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  return {
    success: true,
    message: 'Event retrieved successfully',
    data: toEventResponse(event),
  };
}

/**
 * Get Event by Slug (Public)
 */
export async function getEventBySlug(
  slug: string,
): Promise<ApiResponse<EventResponse>> {
  const event = await prisma.event.findUnique({
    where: { slug },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  // Only show published events for public access
  if (
    event.status === EventStatus.DRAFT ||
    event.status === EventStatus.CANCELLED
  ) {
    throw new NotFoundError('Event not found');
  }

  // Increment view count asynchronously
  prisma.event
    .update({
      where: { id: event.id },
      data: { viewCount: { increment: 1 } },
    })
    .catch((error) => {
      console.error('Failed to increment event view count:', error);
    });

  return {
    success: true,
    message: 'Event retrieved successfully',
    data: toEventResponse(event),
  };
}

/**
 * Get All Events (with pagination and filters)
 */
export async function getAllEvents(
  query: EventQueryParams,
): Promise<PaginatedResult<EventListItemResponse>> {
  const {
    page = 1,
    limit = 10,
    search,
    eventType,
    status,
    locationType,
    city,
    country,
    year,
    month,
    sortBy = 'eventDate',
    sortOrder = 'desc',
  } = query;

  // Ensure numbers
  const pageNum =
    typeof page === 'number' ? page : parseInt(String(page), 10) || 1;
  const limitNum =
    typeof limit === 'number' ? limit : parseInt(String(limit), 10) || 10;
  const skip = (pageNum - 1) * limitNum;

  // Build where clause
  const where: Prisma.EventWhereInput = {};

  // Search filter
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { venue: { contains: search, mode: 'insensitive' } },
      { organizerName: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Filter by event type
  if (eventType) {
    where.eventType = eventType;
  }

  // Filter by status
  if (status) {
    where.status = status;
  }

  // Filter by location type
  if (locationType) {
    where.locationType = locationType;
  }

  // Filter by city
  if (city) {
    where.city = { contains: city, mode: 'insensitive' };
  }

  // Filter by country
  if (country) {
    where.country = { contains: country, mode: 'insensitive' };
  }

  // Filter by year
  if (year) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    where.eventDate = {
      gte: startOfYear,
      lt: endOfYear,
    };
  }

  // Filter by month (requires year)
  if (month && year) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);
    where.eventDate = {
      gte: startOfMonth,
      lt: endOfMonth,
    };
  }

  // Build orderBy
  const orderBy: Prisma.EventOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  // Execute queries
  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
    }),
    prisma.event.count({ where }),
  ]);

  const data = events.map(toEventListItemResponse);
  const pagination = calculatePagination(total, pageNum, limitNum);

  return {
    data,
    pagination,
  };
}

/**
 * Update Event
 */
export async function updateEvent(
  eventId: string,
  data: UpdateEventRequest,
): Promise<ApiResponse<EventResponse>> {
  // Check if event exists
  const existingEvent = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!existingEvent) {
    throw new NotFoundError('Event not found');
  }

  // Check slug uniqueness if changing slug
  if (data.slug && data.slug !== existingEvent.slug) {
    const slugExists = await prisma.event.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists) {
      throw new ConflictError(`Event with slug '${data.slug}' already exists`);
    }
  }

  // Handle publishedAt
  let publishedAt = existingEvent.publishedAt;
  if (data.publishedAt !== undefined) {
    publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
  } else if (
    data.status &&
    (data.status === EventStatus.UPCOMING ||
      data.status === EventStatus.ONGOING ||
      data.status === EventStatus.COMPLETED) &&
    !existingEvent.publishedAt
  ) {
    publishedAt = new Date();
  }

  // Update event
  const event = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      slug: data.slug,
      description:
        data.description !== undefined ? data.description : undefined,
      content: data.content !== undefined ? data.content : undefined,
      eventType: data.eventType,
      status: data.status,
      locationType: data.locationType,

      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      startTime: data.startTime !== undefined ? data.startTime : undefined,
      endTime: data.endTime !== undefined ? data.endTime : undefined,
      timezone: data.timezone,

      venue: data.venue !== undefined ? data.venue : undefined,
      address: data.address !== undefined ? data.address : undefined,
      city: data.city !== undefined ? data.city : undefined,
      country: data.country !== undefined ? data.country : undefined,
      mapUrl: data.mapUrl !== undefined ? data.mapUrl : undefined,

      platformName:
        data.platformName !== undefined ? data.platformName : undefined,
      platformUrl:
        data.platformUrl !== undefined ? data.platformUrl : undefined,

      organizerName:
        data.organizerName !== undefined ? data.organizerName : undefined,
      organizerUrl:
        data.organizerUrl !== undefined ? data.organizerUrl : undefined,

      role: data.role !== undefined ? data.role : undefined,
      topics: data.topics,
      participants:
        data.participants !== undefined ? data.participants : undefined,

      featuredImageUrl:
        data.featuredImageUrl !== undefined ? data.featuredImageUrl : undefined,
      galleryImages: data.galleryImages,

      metaTitle: data.metaTitle !== undefined ? data.metaTitle : undefined,
      metaDescription:
        data.metaDescription !== undefined ? data.metaDescription : undefined,
      metaKeywords: data.metaKeywords,
      ogImageUrl: data.ogImageUrl !== undefined ? data.ogImageUrl : undefined,
      canonicalUrl:
        data.canonicalUrl !== undefined ? data.canonicalUrl : undefined,

      publishedAt,
    },
  });

  return {
    success: true,
    message: 'Event updated successfully',
    data: toEventResponse(event),
  };
}

/**
 * Delete Event
 */
export async function deleteEvent(eventId: string): Promise<ApiResponse<null>> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw new NotFoundError('Event not found');
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  return {
    success: true,
    message: 'Event deleted successfully',
    data: null,
  };
}

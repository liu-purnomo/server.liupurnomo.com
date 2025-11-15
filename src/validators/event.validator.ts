import { z } from 'zod';
import {
  EventType,
  EventStatus,
  EventLocationType,
} from '@prisma/client';

/**
 * Event Validators
 * NO wrapper objects - middleware handles req[source] extraction
 */

// ==================== REUSABLE SCHEMAS ====================

const slugSchema = z
  .string({ message: 'Slug is required' })
  .min(1, 'Slug cannot be empty')
  .max(200, 'Slug must be 200 characters or less')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric with hyphens only'
  );

const urlSchema = z
  .string()
  .refine(
    (val) => !val || /^https?:\/\/.+/.test(val),
    { message: 'Must be a valid URL' }
  )
  .optional()
  .or(z.literal(''));

// ==================== CREATE EVENT ====================

export const createEventSchema = z.object({
  title: z
    .string({ message: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less'),

  slug: slugSchema,

  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),

  content: z.any().optional(), // JSON content

  eventType: z.enum(
    [
      EventType.WORKSHOP,
      EventType.TRAINING,
      EventType.SEMINAR,
      EventType.CONFERENCE,
      EventType.MEETUP,
      EventType.WEBINAR,
      EventType.HACKATHON,
      EventType.TALK,
      EventType.OTHER,
    ],
    { message: 'Invalid event type' }
  ),

  status: z
    .enum(
      [
        EventStatus.DRAFT,
        EventStatus.UPCOMING,
        EventStatus.ONGOING,
        EventStatus.COMPLETED,
        EventStatus.CANCELLED,
      ],
      { message: 'Invalid status' }
    )
    .default(EventStatus.DRAFT),

  locationType: z.enum(
    [EventLocationType.ONLINE, EventLocationType.OFFLINE, EventLocationType.HYBRID],
    { message: 'Invalid location type' }
  ),

  // Event details
  eventDate: z.string({ message: 'Event date is required' }).or(z.date()),

  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),

  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),

  timezone: z
    .string()
    .max(100)
    .default('Asia/Jakarta'),

  // Location
  venue: z
    .string()
    .max(200, 'Venue must be 200 characters or less')
    .optional(),

  address: z
    .string()
    .max(500, 'Address must be 500 characters or less')
    .optional(),

  city: z
    .string()
    .max(100, 'City must be 100 characters or less')
    .optional(),

  country: z
    .string()
    .max(100, 'Country must be 100 characters or less')
    .default('Indonesia'),

  mapUrl: urlSchema,

  // Online details
  platformName: z
    .string()
    .max(100, 'Platform name must be 100 characters or less')
    .optional(),

  platformUrl: urlSchema,

  // Organizer
  organizerName: z
    .string()
    .max(200, 'Organizer name must be 200 characters or less')
    .optional(),

  organizerUrl: urlSchema,

  // Your role
  role: z
    .string()
    .max(100, 'Role must be 100 characters or less')
    .optional(),

  topics: z
    .array(z.string().max(100))
    .max(20, 'Maximum 20 topics')
    .default([]),

  participants: z
    .number()
    .int()
    .min(0, 'Participants must be a positive number')
    .optional(),

  // Images
  featuredImageUrl: urlSchema,

  galleryImages: z
    .array(
      z.string().refine((val) => /^https?:\/\/.+/.test(val), {
        message: 'Must be valid URL',
      })
    )
    .max(50, 'Maximum 50 gallery images')
    .default([]),

  // SEO
  metaTitle: z
    .string()
    .max(200, 'Meta title must be 200 characters or less')
    .optional(),

  metaDescription: z
    .string()
    .max(500, 'Meta description must be 500 characters or less')
    .optional(),

  metaKeywords: z
    .array(z.string().max(50))
    .max(20, 'Maximum 20 keywords')
    .default([]),

  ogImageUrl: urlSchema,

  canonicalUrl: urlSchema,

  publishedAt: z
    .string()
    .or(z.date())
    .optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

// ==================== UPDATE EVENT ====================

export const updateEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be 200 characters or less')
    .optional(),

  slug: slugSchema.optional(),

  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional(),

  content: z.any().optional(),

  eventType: z
    .enum(
      [
        EventType.WORKSHOP,
        EventType.TRAINING,
        EventType.SEMINAR,
        EventType.CONFERENCE,
        EventType.MEETUP,
        EventType.WEBINAR,
        EventType.HACKATHON,
        EventType.TALK,
        EventType.OTHER,
      ],
      { message: 'Invalid event type' }
    )
    .optional(),

  status: z
    .enum(
      [
        EventStatus.DRAFT,
        EventStatus.UPCOMING,
        EventStatus.ONGOING,
        EventStatus.COMPLETED,
        EventStatus.CANCELLED,
      ],
      { message: 'Invalid status' }
    )
    .optional(),

  locationType: z
    .enum(
      [EventLocationType.ONLINE, EventLocationType.OFFLINE, EventLocationType.HYBRID],
      { message: 'Invalid location type' }
    )
    .optional(),

  // Event details
  eventDate: z
    .string()
    .or(z.date())
    .optional(),

  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),

  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
    .optional(),

  timezone: z
    .string()
    .max(100)
    .optional(),

  // Location
  venue: z
    .string()
    .max(200)
    .optional(),

  address: z
    .string()
    .max(500)
    .optional(),

  city: z
    .string()
    .max(100)
    .optional(),

  country: z
    .string()
    .max(100)
    .optional(),

  mapUrl: urlSchema,

  // Online details
  platformName: z
    .string()
    .max(100)
    .optional(),

  platformUrl: urlSchema,

  // Organizer
  organizerName: z
    .string()
    .max(200)
    .optional(),

  organizerUrl: urlSchema,

  // Your role
  role: z
    .string()
    .max(100)
    .optional(),

  topics: z
    .array(z.string().max(100))
    .max(20, 'Maximum 20 topics')
    .optional(),

  participants: z
    .number()
    .int()
    .min(0)
    .optional(),

  // Images
  featuredImageUrl: urlSchema,

  galleryImages: z
    .array(
      z.string().refine((val) => /^https?:\/\/.+/.test(val), {
        message: 'Must be valid URL',
      })
    )
    .max(50, 'Maximum 50 gallery images')
    .optional(),

  // SEO
  metaTitle: z
    .string()
    .max(200)
    .optional(),

  metaDescription: z
    .string()
    .max(500)
    .optional(),

  metaKeywords: z
    .array(z.string().max(50))
    .max(20, 'Maximum 20 keywords')
    .optional(),

  ogImageUrl: urlSchema,

  canonicalUrl: urlSchema,

  publishedAt: z
    .string()
    .or(z.date())
    .optional(),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// ==================== PARAMS SCHEMAS ====================

export const eventIdParamsSchema = z.object({
  id: z.string({ message: 'Event ID is required' }),
});

export type EventIdInput = z.infer<typeof eventIdParamsSchema>;

export const eventSlugParamsSchema = z.object({
  slug: z.string({ message: 'Event slug is required' }),
});

export type EventSlugInput = z.infer<typeof eventSlugParamsSchema>;

// ==================== QUERY SCHEMA ====================

export const eventQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  search: z.string().optional(),

  eventType: z
    .enum([
      EventType.WORKSHOP,
      EventType.TRAINING,
      EventType.SEMINAR,
      EventType.CONFERENCE,
      EventType.MEETUP,
      EventType.WEBINAR,
      EventType.HACKATHON,
      EventType.TALK,
      EventType.OTHER,
    ])
    .optional(),

  status: z
    .enum([
      EventStatus.DRAFT,
      EventStatus.UPCOMING,
      EventStatus.ONGOING,
      EventStatus.COMPLETED,
      EventStatus.CANCELLED,
    ])
    .optional(),

  locationType: z
    .enum([EventLocationType.ONLINE, EventLocationType.OFFLINE, EventLocationType.HYBRID])
    .optional(),

  city: z.string().optional(),

  country: z.string().optional(),

  year: z.coerce.number().int().optional(),

  month: z.coerce
    .number()
    .int()
    .refine((val) => val >= 1 && val <= 12, {
      message: 'Month must be between 1 and 12',
    })
    .optional(),

  sortBy: z
    .enum([
      'eventDate',
      'createdAt',
      'updatedAt',
      'title',
      'viewCount',
      'participants',
    ])
    .default('eventDate'),

  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type EventQueryInput = z.infer<typeof eventQuerySchema>;

import type { EventLocationType, EventStatus, EventType } from '@prisma/client';

/**
 * Event Types and Interfaces
 */

// ==================== REQUEST TYPES ====================

/**
 * Create Event Request
 */
export interface CreateEventRequest {
  title: string;
  slug: string;
  description?: string;
  content?: any; // JSON content
  eventType: EventType;
  status?: EventStatus;
  locationType: EventLocationType;

  // Event details
  eventDate: Date | string;
  startTime?: string;
  endTime?: string;
  timezone?: string;

  // Location
  venue?: string;
  address?: string;
  city?: string;
  country?: string;
  mapUrl?: string;

  // Online details
  platformName?: string;
  platformUrl?: string;

  // Organizer
  organizerName?: string;
  organizerUrl?: string;

  // Your role
  role?: string;
  topics?: string[];
  participants?: number;

  // Images
  featuredImageUrl?: string;
  galleryImages?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImageUrl?: string;
  canonicalUrl?: string;

  publishedAt?: Date | string;
}

/**
 * Update Event Request
 */
export interface UpdateEventRequest {
  title?: string;
  slug?: string;
  description?: string;
  content?: any;
  eventType?: EventType;
  status?: EventStatus;
  locationType?: EventLocationType;

  // Event details
  eventDate?: Date | string;
  startTime?: string;
  endTime?: string;
  timezone?: string;

  // Location
  venue?: string;
  address?: string;
  city?: string;
  country?: string;
  mapUrl?: string;

  // Online details
  platformName?: string;
  platformUrl?: string;

  // Organizer
  organizerName?: string;
  organizerUrl?: string;

  // Your role
  role?: string;
  topics?: string[];
  participants?: number;

  // Images
  featuredImageUrl?: string;
  galleryImages?: string[];

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImageUrl?: string;
  canonicalUrl?: string;

  publishedAt?: Date | string;
}

/**
 * Event Query Parameters
 */
export interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  eventType?: EventType;
  status?: EventStatus;
  locationType?: EventLocationType;
  city?: string;
  country?: string;
  year?: number;
  month?: number;
  sortBy?:
    | 'eventDate'
    | 'createdAt'
    | 'updatedAt'
    | 'title'
    | 'viewCount'
    | 'participants';
  sortOrder?: 'asc' | 'desc';
}

// ==================== RESPONSE TYPES ====================

/**
 * Event Response (Full details)
 */
export interface EventResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: any;
  eventType: EventType;
  status: EventStatus;
  locationType: EventLocationType;

  // Event details
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  timezone: string;

  // Location
  venue: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  mapUrl: string | null;

  // Online details
  platformName: string | null;
  platformUrl: string | null;

  // Organizer
  organizerName: string | null;
  organizerUrl: string | null;

  // Your role
  role: string | null;
  topics: string[];
  participants: number | null;

  // Images
  featuredImageUrl: string | null;
  galleryImages: string[];

  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  ogImageUrl: string | null;
  canonicalUrl: string | null;

  // Metrics
  viewCount: number;

  // Timestamps
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Event List Item Response (Simplified for lists)
 */
export interface EventListItemResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  eventType: EventType;
  status: EventStatus;
  locationType: EventLocationType;
  organizerName: string | null;

  // Key details
  eventDate: string;
  city: string | null;
  country: string | null;
  venue: string | null;

  // Your role
  role: string | null;
  topics: string[];
  participants: number | null;

  // Images
  featuredImageUrl: string | null;

  // Metrics
  viewCount: number;

  // Timestamps
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

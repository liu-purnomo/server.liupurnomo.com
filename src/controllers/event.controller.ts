import type { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service.js';
import type {
  CreateEventRequest,
  UpdateEventRequest,
  EventQueryParams,
} from '../types/index.js';
import { sendCreated, sendSuccess, sendPaginatedSuccess } from '../utils/index.js';

/**
 * Event Controller
 */

/**
 * Create Event
 * POST /api/events
 */
export async function createEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data: CreateEventRequest = req.body;
    const result = await eventService.createEvent(data);

    sendCreated(res, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get Event by ID
 * GET /api/events/:id
 */
export async function getEventById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await eventService.getEventById(id);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get Event by Slug (Public)
 * GET /api/events/slug/:slug
 */
export async function getEventBySlug(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const slug = req.params.slug as string;
    const result = await eventService.getEventBySlug(slug);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Get All Events
 * GET /api/events
 */
export async function getAllEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query: EventQueryParams = req.query;
    const result = await eventService.getAllEvents(query);

    sendPaginatedSuccess(
      res,
      'Events retrieved successfully',
      result.data,
      result.pagination
    );
  } catch (error) {
    next(error);
  }
}

/**
 * Update Event
 * PATCH /api/events/:id
 */
export async function updateEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const data: UpdateEventRequest = req.body;
    const result = await eventService.updateEvent(id, data);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete Event
 * DELETE /api/events/:id
 */
export async function deleteEvent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params.id as string;
    const result = await eventService.deleteEvent(id);

    sendSuccess(res, 200, result.message, result.data);
  } catch (error) {
    next(error);
  }
}

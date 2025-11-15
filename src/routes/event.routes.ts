import { Router } from 'express';
import * as eventController from '../controllers/event.controller.js';
import { validate } from '../middlewares/validate.js';
import { authenticate, requireRole } from '../middlewares/auth.js';
import {
  createEventSchema,
  updateEventSchema,
  eventIdParamsSchema,
  eventSlugParamsSchema,
  eventQuerySchema,
} from '../validators/event.validator.js';

const router = Router();

/**
 * Event Routes
 *
 * Public routes: GET /api/events, GET /api/events/slug/:slug
 * Protected routes (ADMIN/AUTHOR): POST, PATCH, DELETE
 */

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/events
 * @desc    Get all events (with filters and pagination)
 * @access  Public
 */
router.get(
  '/',
  validate(eventQuerySchema, 'query'),
  eventController.getAllEvents
);

/**
 * @route   GET /api/events/slug/:slug
 * @desc    Get event by slug (public)
 * @access  Public
 */
router.get(
  '/slug/:slug',
  validate(eventSlugParamsSchema, 'params'),
  eventController.getEventBySlug
);

// ==================== PROTECTED ROUTES (ADMIN/AUTHOR) ====================

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private (ADMIN, AUTHOR)
 */
router.post(
  '/',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(createEventSchema),
  eventController.createEvent
);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Private (ADMIN, AUTHOR)
 */
router.get(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(eventIdParamsSchema, 'params'),
  eventController.getEventById
);

/**
 * @route   PATCH /api/events/:id
 * @desc    Update event
 * @access  Private (ADMIN, AUTHOR)
 */
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(eventIdParamsSchema, 'params'),
  validate(updateEventSchema),
  eventController.updateEvent
);

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private (ADMIN, AUTHOR)
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN', 'AUTHOR'),
  validate(eventIdParamsSchema, 'params'),
  eventController.deleteEvent
);

export default router;

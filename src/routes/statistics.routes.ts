/**
 * Statistics Routes
 * Endpoints for blog statistics and analytics
 */

import { Router } from 'express';
import * as statisticsController from '../controllers/statistics.controller.js';
import { authenticate, requireRole } from '../middlewares/auth.js';

const router = Router();

/**
 * @route   GET /api/statistics
 * @desc    Get comprehensive blog statistics
 * @access  Private - Admin only
 */
router.get(
  '/',
  authenticate,
  requireRole('ADMIN'),
  statisticsController.getBlogStatistics
);

export default router;

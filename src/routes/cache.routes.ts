import { Router } from 'express';
import { cacheController } from '../controllers/index.js';
import { authenticate, requireRole } from '../middlewares/index.js';

/**
 * Cache Routes
 * Admin-only routes for cache management
 */

const router = Router();

// ==================== ADMIN ONLY ROUTES ====================
// All cache management endpoints require ADMIN role

/**
 * Clear All Cache
 * DELETE /api/cache/clear
 * Requires ADMIN role
 */
router.delete(
  '/clear',
  authenticate,
  requireRole('ADMIN'),
  cacheController.clearAllCache
);

/**
 * Get Cache Stats
 * GET /api/cache/stats
 * Requires ADMIN role
 */
router.get(
  '/stats',
  authenticate,
  requireRole('ADMIN'),
  cacheController.getCacheStats
);

export default router;

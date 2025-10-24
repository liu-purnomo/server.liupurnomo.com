import { Router } from 'express';
import authRoutes from './auth.routes.js';

/**
 * API Routes Index
 * Main router that combines all route modules
 */

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);

export default router;

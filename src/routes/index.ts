import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import categoryRoutes from './category.routes.js';
import tagRoutes from './tag.routes.js';

/**
 * API Routes Index
 * Main router that combines all route modules
 */

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);

export default router;

import { Router } from 'express';
import activityLogRoutes from './activity-log.routes.js';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import mediaRoutes from './media.routes.js';
import postRoutes from './post.routes.js';
import tagRoutes from './tag.routes.js';
import userRoutes from './user.routes.js';

/**
 * API Routes Index
 * Main router that combines all route modules
 */

const router = Router();

// Mount route modules
router.use('/activity-logs', activityLogRoutes);
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/media', mediaRoutes);
router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);
router.use('/users', userRoutes);

export default router;

import { Router } from 'express';
import activityLogRoutes from './activity-log.routes.js';
import authRoutes from './auth.routes.js';
import bookmarkRoutes from './bookmark.routes.js';
import categoryRoutes from './category.routes.js';
import commentRoutes from './comment.routes.js';
import eventRoutes from './event.routes.js';
import mediaRoutes from './media.routes.js';
import postRoutes from './post.routes.js';
import postSeriesRoutes from './postSeries.routes.js';
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
router.use('/bookmarks', bookmarkRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/events', eventRoutes);
router.use('/media', mediaRoutes);
router.use('/posts', postRoutes);
router.use('/post-series', postSeriesRoutes);
router.use('/tags', tagRoutes);
router.use('/users', userRoutes);

export default router;

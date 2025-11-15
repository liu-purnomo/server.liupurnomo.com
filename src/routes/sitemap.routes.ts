/**
 * Sitemap Routes
 * Public endpoint for sitemap data
 */

import { Router } from 'express';
import * as sitemapController from '../controllers/sitemap.controller.js';

const router = Router();

/**
 * @route   GET /api/sitemap
 * @desc    Get sitemap data for all public content
 * @access  Public
 */
router.get('/', sitemapController.getSitemapData);

export default router;

/**
 * API Documentation Index
 * Merge all API path definitions
 */

import { activityLogPaths } from './activity-log.docs.js';
import { authPaths } from './auth.docs.js';
import { bookmarkPaths } from './bookmark.docs.js';
import { categoryPaths } from './category.docs.js';
import { commentPaths } from './comment.docs.js';
import { eventPaths } from './event.docs.js';
import { mediaPaths } from './media.docs.js';
import { notificationPreferencePaths } from './notificationPreference.docs.js';
import { postPaths } from './post.docs.js';
import { statisticsPaths } from './statistics.docs.js';
import { tagPaths } from './tag.docs.js';
import { userPaths } from './user.docs.js';

export const paths = {
  ...activityLogPaths,
  ...authPaths,
  ...bookmarkPaths,
  ...categoryPaths,
  ...commentPaths,
  ...eventPaths,
  ...mediaPaths,
  ...notificationPreferencePaths,
  ...postPaths,
  ...statisticsPaths,
  ...tagPaths,
  ...userPaths,
};

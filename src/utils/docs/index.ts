/**
 * API Documentation Index
 * Merge all API path definitions
 */

import { activityLogPaths } from './activity-log.docs.js';
import { authPaths } from './auth.docs.js';
import { categoryPaths } from './category.docs.js';
import { notificationPreferencePaths } from './notificationPreference.docs.js';
import { tagPaths } from './tag.docs.js';
import { userPaths } from './user.docs.js';

export const paths = {
  ...activityLogPaths,
  ...authPaths,
  ...categoryPaths,
  ...notificationPreferencePaths,
  ...tagPaths,
  ...userPaths,
};

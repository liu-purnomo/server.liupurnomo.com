/**
 * Schemas Index
 * Merge all schema definitions
 */

import { activityLogSchemas } from './activity-log.schema.js';
import { authSchemas } from './auth.schema.js';
import { bookmarkSchemas } from './bookmark.schema.js';
import { categorySchemas } from './category.schema.js';
import { commentSchemas } from './comment.schema.js';
import { commonSchemas } from './common.schema.js';
import { eventSchemas } from './event.schema.js';
import { mediaSchemas } from './media.schema.js';
import { notificationSchemas } from './notification.schema.js';
import { notificationPreferenceSchemas } from './notificationPreference.schema.js';
import { postSchemas } from './post.schema.js';
import { statisticsSchemas } from './statistics.schema.js';
import { tagSchemas } from './tag.schema.js';
import { userSchemas } from './user.schema.js';

export const schemas = {
  ...commonSchemas,
  ...activityLogSchemas,
  ...authSchemas,
  ...bookmarkSchemas,
  ...categorySchemas,
  ...commentSchemas,
  ...eventSchemas,
  ...mediaSchemas,
  ...notificationSchemas,
  ...notificationPreferenceSchemas,
  ...postSchemas,
  ...statisticsSchemas,
  ...tagSchemas,
  ...userSchemas,
};

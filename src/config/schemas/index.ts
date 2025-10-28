/**
 * Schemas Index
 * Merge all schema definitions
 */

import { activityLogSchemas } from './activity-log.schema.js';
import { authSchemas } from './auth.schema.js';
import { categorySchemas } from './category.schema.js';
import { commonSchemas } from './common.schema.js';
import { notificationPreferenceSchemas } from './notificationPreference.schema.js';
import { tagSchemas } from './tag.schema.js';
import { userSchemas } from './user.schema.js';

export const schemas = {
  ...commonSchemas,
  ...activityLogSchemas,
  ...authSchemas,
  ...categorySchemas,
  ...notificationPreferenceSchemas,
  ...tagSchemas,
  ...userSchemas,
};

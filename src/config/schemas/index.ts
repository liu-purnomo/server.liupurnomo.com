/**
 * Schemas Index
 * Merge all schema definitions
 */

import { commonSchemas } from './common.schema.js';
import { authSchemas } from './auth.schema.js';
import { userSchemas } from './user.schema.js';
import { categorySchemas } from './category.schema.js';
import { tagSchemas } from './tag.schema.js';
import { notificationPreferenceSchemas } from './notificationPreference.schema.js';

export const schemas = {
  ...commonSchemas,
  ...authSchemas,
  ...userSchemas,
  ...categorySchemas,
  ...tagSchemas,
  ...notificationPreferenceSchemas,
};

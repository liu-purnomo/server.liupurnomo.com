/**
 * Schemas Index
 * Merge all schema definitions
 */

import { commonSchemas } from './common.schema.js';
import { authSchemas } from './auth.schema.js';

export const schemas = {
  ...commonSchemas,
  ...authSchemas,
};

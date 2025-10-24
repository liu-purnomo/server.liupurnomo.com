/**
 * Schemas Index
 * Merge all schema definitions
 */

import { authSchemas } from './auth.schema.js';

export const schemas = {
  ...authSchemas,
};

/**
 * API Documentation Index
 * Merge all API path definitions
 */

import { authPaths } from './auth.docs.js';
import { userPaths } from './user.docs.js';

export const paths = {
  ...authPaths,
  ...userPaths,
};

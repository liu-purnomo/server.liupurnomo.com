/**
 * Express Type Extensions
 * Extend Express Request interface with custom user type
 */

import { TokenPayload } from './auth.types.js';

declare global {
  namespace Express {
    interface User {
      id: string;
      userId: string;
      email: string;
      username: string;
      role: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors.js';

/**
 * Validation Middleware
 * Validate request using Zod schema
 */

/**
 * Validate Request Middleware
 * Validates request body, query, and params against Zod schema
 *
 * @param schema - Zod schema object
 * @returns Express middleware function
 */
export function validate(schema: ZodSchema) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into user-friendly messages
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        next(
          new ValidationError(
            'Validation failed',
            errors
          )
        );
      } else {
        next(error);
      }
    }
  };
}

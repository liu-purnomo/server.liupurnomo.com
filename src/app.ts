import { apiReference } from '@scalar/express-api-reference';
import cors from 'cors';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { openapiConfig } from './config/openapi.config.js';
import passport from './config/passport.config.js';
import { connectRedis, getRedisInfo } from './lib/redis.js';
import {
  apiLimiter,
  errorHandler,
  notFoundHandler,
} from './middlewares/index.js';

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 4000;

// Trust proxy - for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// CORS Configuration - Only allow requests from liupurnomo.com
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://liupurnomo.com',
        'https://www.liupurnomo.com',
        'http://localhost:3000', // For local development
        // 'http://localhost:5173', // For local development (Vite)
      ];

      // Allow requests with no origin (like mobile apps, Postman, curl)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Global rate limiter for all API routes
app.use('/api', apiLimiter);

// Serve static files
app.use(express.static('public'));

// Serve uploaded files (avatars, images, etc.)
app.use('/uploads', express.static('storages'));

// API Documentation with Scalar
app.use(
  '/docs',
  apiReference({
    theme: 'purple',
    content: openapiConfig,
    favicon: '/favicon.ico',
    pageTitle: 'Liu Purnomo API Documentation',
  })
);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Drone Server API',
    data: {
      version: '1.15.0',
      status: 'running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      endpoints: {
        api: '/api',
        health: '/health',
        docs: '/docs',
      },
    },
  });
});

// Health check endpoint
app.get('/health', async (_req: Request, res: Response) => {
  const redisInfo = await getRedisInfo();

  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
      redis: redisInfo,
    },
  });
});

// API Routes
import routes from './routes/index.js';
app.use('/api', routes);

// 404 Handler - Must be after all routes
app.use(notFoundHandler);

// Global Error Handler - Must be last
app.use(errorHandler);

httpServer.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API Documentation: http://localhost:${port}/docs`);

  // Initialize Redis connection
  try {
    await connectRedis();
  } catch (error) {
    console.warn(
      '⚠️  Redis connection failed - server will run without caching'
    );
  }
});

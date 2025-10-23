import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Instance
 * Singleton pattern for database connection
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown
 * Disconnect Prisma on process termination
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

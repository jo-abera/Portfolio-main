import { Prisma } from '@prisma/client';
import { ApiError } from '../middleware/errorHandler.js';

export const mapPrismaError = (err) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') return new ApiError(404, 'Not found');
    if (err.code === 'P2002') return new ApiError(400, 'Duplicate entry');
    if (err.code === 'P1001') {
      return new ApiError(503, 'Database temporarily unreachable. Retry in a moment.');
    }
    return new ApiError(400, err.message);
  }
  if (err.name === 'PrismaClientInitializationError') {
    return new ApiError(503, 'Database connection failed. Check DATABASE_URL in backend/.env.');
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    return new ApiError(
      400,
      process.env.NODE_ENV === 'production' ? 'Invalid data' : err.message.split('\n').slice(0, 3).join(' ')
    );
  }
  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    const msg = err.message || '';
    if (/social_links_platform_check|23514/.test(msg) && /platform/i.test(msg)) {
      return new ApiError(
        400,
        'This social platform is not allowed by the database yet. Run database/migrations/0006_social_platforms_whatsapp_telegram.sql in Supabase SQL Editor, then try again.'
      );
    }
  }
  return err;
};

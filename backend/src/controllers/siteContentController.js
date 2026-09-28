import { prisma } from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPrismaError } from '../utils/prismaError.js';

export const getPublic = asyncHandler(async (req, res) => {
  const [settings, socialLinks] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.socialLink.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' },
    }),
  ]);
  if (!settings) throw new ApiError(500, 'Site settings not initialized');
  res.json({ ...settings, social_links: socialLinks });
});

export const getAdmin = asyncHandler(async (req, res) => {
  const data = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!data) throw new ApiError(500, 'Site settings not initialized');
  res.json(data);
});

export const updateSettings = asyncHandler(async (req, res) => {
  try {
    const data = await prisma.siteSettings.update({
      where: { id: 1 },
      data: req.body,
    });
    res.json(data);
  } catch (err) {
    throw mapPrismaError(err);
  }
});

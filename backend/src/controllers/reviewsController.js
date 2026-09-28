import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPrismaError } from '../utils/prismaError.js';
import { sanitizeFields } from '../utils/sanitize.js';

export const listPublic = asyncHandler(async (req, res) => {
  const data = await prisma.review.findMany({
    where: { is_approved: true },
    orderBy: { submitted_at: 'desc' },
  });
  res.json(data);
});

export const submit = asyncHandler(async (req, res) => {
  const payload = sanitizeFields(req.body, ['client_name', 'client_role', 'company', 'review_text']);
  try {
    const data = await prisma.review.create({
      data: { ...payload, rating: req.body.rating, is_approved: false },
    });
    res.status(201).json({ message: 'Thanks! Your review will appear once approved.', review: data });
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const listAdmin = asyncHandler(async (req, res) => {
  const data = await prisma.review.findMany({ orderBy: { submitted_at: 'desc' } });
  res.json(data);
});

export const approve = asyncHandler(async (req, res) => {
  try {
    const data = await prisma.review.update({
      where: { id: req.params.id },
      data: { is_approved: true },
    });
    res.json(data);
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const remove = asyncHandler(async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    throw mapPrismaError(err);
  }
});

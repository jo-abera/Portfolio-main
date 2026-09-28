import { prisma } from '../config/prisma.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPrismaError } from '../utils/prismaError.js';
import { slugify, uniqueSlug } from '../utils/slugify.js';

const slugExists = async (slug, excludeId) => {
  const existing = await prisma.project.findFirst({
    where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    select: { id: true },
  });
  return Boolean(existing);
};

export const listPublic = asyncHandler(async (req, res) => {
  const data = await prisma.project.findMany({
    where: {
      is_published: true,
      ...(req.query.featured === 'true' ? { featured: true } : {}),
    },
    orderBy: { display_order: 'asc' },
  });
  res.json(data);
});

export const getBySlugPublic = asyncHandler(async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { slug: req.params.slug, is_published: true },
    include: {
      images: { orderBy: { display_order: 'asc' } },
    },
  });
  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ ...project, images: project.images });
});

export const listAdmin = asyncHandler(async (req, res) => {
  const data = await prisma.project.findMany({ orderBy: { display_order: 'asc' } });
  res.json(data);
});

export const getByIdAdmin = asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      images: { orderBy: { display_order: 'asc' } },
    },
  });
  if (!project) throw new ApiError(404, 'Project not found');
  res.json({ ...project, images: project.images });
});

export const create = asyncHandler(async (req, res) => {
  const { slug: requestedSlug, ...rest } = req.body;
  const base = requestedSlug ? slugify(requestedSlug) : slugify(rest.title);
  const slug = await uniqueSlug(base, (candidate) => slugExists(candidate));

  try {
    const data = await prisma.project.create({ data: { ...rest, slug } });
    res.status(201).json(data);
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const update = asyncHandler(async (req, res) => {
  const { slug: requestedSlug, ...rest } = req.body;
  const payload = { ...rest };

  if (requestedSlug) {
    const base = slugify(requestedSlug);
    payload.slug = await uniqueSlug(base, (candidate) => slugExists(candidate, req.params.id));
  }

  try {
    const data = await prisma.project.update({
      where: { id: req.params.id },
      data: payload,
    });
    res.json(data);
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const remove = asyncHandler(async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const addImage = asyncHandler(async (req, res) => {
  try {
    const data = await prisma.projectImage.create({
      data: { ...req.body, project_id: req.params.id },
    });
    res.status(201).json(data);
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const removeImage = asyncHandler(async (req, res) => {
  try {
    await prisma.projectImage.deleteMany({
      where: { id: req.params.imageId, project_id: req.params.id },
    });
    res.status(204).end();
  } catch (err) {
    throw mapPrismaError(err);
  }
});

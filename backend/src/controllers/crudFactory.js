import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPrismaError } from '../utils/prismaError.js';

const run = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    throw mapPrismaError(err);
  }
};

// Generic CRUD for admin-managed lists (services, skills, resume sections, etc.)
export const createCrudController = ({ delegate, orderBy = 'display_order', publicFilter = null }) => {
  const order = { [orderBy]: 'asc' };

  const listPublic = asyncHandler(async (req, res) => {
    const data = await run(() =>
      delegate.findMany({
        where: publicFilter ?? undefined,
        orderBy: order,
      })
    );
    res.json(data);
  });

  const listAdmin = asyncHandler(async (req, res) => {
    const data = await run(() => delegate.findMany({ orderBy: order }));
    res.json(data);
  });

  const create = asyncHandler(async (req, res) => {
    const data = await run(() => delegate.create({ data: req.body }));
    res.status(201).json(data);
  });

  const update = asyncHandler(async (req, res) => {
    try {
      const data = await delegate.update({
        where: { id: req.params.id },
        data: req.body,
      });
      res.json(data);
    } catch (err) {
      throw mapPrismaError(err);
    }
  });

  const remove = asyncHandler(async (req, res) => {
    try {
      await delegate.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (err) {
      throw mapPrismaError(err);
    }
  });

  return { listPublic, listAdmin, create, update, remove };
};

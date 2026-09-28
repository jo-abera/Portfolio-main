import { Router } from 'express';
import { createCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../config/prisma.js';
import { validateBody } from '../middleware/validate.js';
import { serviceSchema, serviceUpdateSchema } from '../validators/services.js';

const ctrl = createCrudController({ delegate: prisma.service, publicFilter: { is_active: true } });

export const publicRouter = Router();
publicRouter.get('/', ctrl.listPublic);

export const adminRouter = Router();
adminRouter.get('/', ctrl.listAdmin);
adminRouter.post('/', validateBody(serviceSchema), ctrl.create);
adminRouter.put('/:id', validateBody(serviceUpdateSchema), ctrl.update);
adminRouter.delete('/:id', ctrl.remove);

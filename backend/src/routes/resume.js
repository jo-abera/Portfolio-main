import { Router } from 'express';
import { createCrudController } from '../controllers/crudFactory.js';
import { prisma } from '../config/prisma.js';
import { validateBody } from '../middleware/validate.js';
import {
  experienceSchema,
  experienceUpdateSchema,
  educationSchema,
  educationUpdateSchema,
} from '../validators/resume.js';

const experienceCtrl = createCrudController({ delegate: prisma.experience });
const educationCtrl = createCrudController({ delegate: prisma.education });

export const publicRouter = Router();
publicRouter.get('/experiences', experienceCtrl.listPublic);
publicRouter.get('/education', educationCtrl.listPublic);

export const adminRouter = Router();
adminRouter.get('/experiences', experienceCtrl.listAdmin);
adminRouter.post('/experiences', validateBody(experienceSchema), experienceCtrl.create);
adminRouter.put('/experiences/:id', validateBody(experienceUpdateSchema), experienceCtrl.update);
adminRouter.delete('/experiences/:id', experienceCtrl.remove);

adminRouter.get('/education', educationCtrl.listAdmin);
adminRouter.post('/education', validateBody(educationSchema), educationCtrl.create);
adminRouter.put('/education/:id', validateBody(educationUpdateSchema), educationCtrl.update);
adminRouter.delete('/education/:id', educationCtrl.remove);

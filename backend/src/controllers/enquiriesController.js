import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPrismaError } from '../utils/prismaError.js';
import { sanitizeFields } from '../utils/sanitize.js';

export const submit = asyncHandler(async (req, res) => {
  const payload = sanitizeFields(req.body, ['name', 'company', 'subject', 'message']);
  try {
    const data = await prisma.contactEnquiry.create({
      data: {
        ...payload,
        email: req.body.email,
        phone: req.body.phone || null,
        status: 'new',
      },
    });
    res.status(201).json({ message: 'Message sent — thanks for reaching out!', enquiry: { id: data.id } });
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const listAdmin = asyncHandler(async (req, res) => {
  const data = await prisma.contactEnquiry.findMany({
    where: req.query.status ? { status: req.query.status } : undefined,
    orderBy: { created_at: 'desc' },
  });
  res.json(data);
});

export const updateStatus = asyncHandler(async (req, res) => {
  try {
    const data = await prisma.contactEnquiry.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(data);
  } catch (err) {
    throw mapPrismaError(err);
  }
});

export const remove = asyncHandler(async (req, res) => {
  try {
    await prisma.contactEnquiry.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    throw mapPrismaError(err);
  }
});

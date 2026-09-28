import { prisma } from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [
    totalServices,
    totalSkills,
    totalProjects,
    publishedProjects,
    upcomingProjects,
    approvedReviews,
    pendingReviews,
    totalEnquiries,
    newEnquiries,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.skill.count(),
    prisma.project.count(),
    prisma.project.count({ where: { is_published: true } }),
    prisma.upcomingProject.count({ where: { is_published: true } }),
    prisma.review.count({ where: { is_approved: true } }),
    prisma.review.count({ where: { is_approved: false } }),
    prisma.contactEnquiry.count(),
    prisma.contactEnquiry.count({ where: { status: 'new' } }),
  ]);

  res.json({
    totalServices,
    totalSkills,
    totalProjects,
    publishedProjects,
    upcomingProjects,
    approvedReviews,
    pendingReviews,
    totalEnquiries,
    newEnquiries,
  });
});

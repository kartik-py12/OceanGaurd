import express from 'express';
import { isAdmin } from '../middleware/isAdmin';
import {
  getDashboardStats,
  getAllReports,
  verifyReport,
  declineReport,
  deleteReport,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../controllers/adminController';

const router = express.Router();

router.use(isAdmin);

router.get('/dashboard/stats', getDashboardStats);

router.get('/reports', getAllReports);
router.put('/reports/:id/verify', verifyReport);
router.put('/reports/:id/decline', declineReport);
router.delete('/reports/:id', deleteReport);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

export default router;

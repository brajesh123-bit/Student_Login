import express from 'express';
import {
  getProfile,
  loginStudent,
  registerStudent,
  updateCourse,
  updatePassword,
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.get('/profile', protect, getProfile);
router.put('/update-password', protect, updatePassword);
router.put('/update-course', protect, updateCourse);

export default router;

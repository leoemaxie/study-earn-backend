import {Router} from 'express';
import {
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
} from '@controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.post('/reset-password', resetPassword);

export default router;

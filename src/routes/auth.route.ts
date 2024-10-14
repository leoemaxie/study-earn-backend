import {Router} from 'express';
import * as authController from '@controllers/auth.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/reset-password', authController.resetPassword);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-email', authController.verifyEmail);

export default router;

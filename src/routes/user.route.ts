import {Router} from 'express';
import * as userController from '@controllers/user.controller';
import * as paymentController from '@controllers/payment.controller';
import fileRoute from './user.file.route';
import paymentRoute from './payment.route';

const router = Router();

router.get('/profile', userController.getUserData);
router.patch('', userController.updateUserData);
router.delete('', userController.deleteUser);
router.get('/student', userController.getMates);
router.use('/file', fileRoute);
router.use('/payment/method', paymentRoute);
router.get('/payment/redeem', paymentController.redeemPoints);
router.get('/payment/history', paymentController.getPaymentHistory);

export default router;

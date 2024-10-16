import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import fileRoute from './user.file.route';
import paymentRoute from './payment.route';
import {redeemPoints} from '@controllers/payment.controller';

const router = Router();

router.get('/profile', userController.getUserData);
router.patch('', userController.updateUserData);
router.delete('', userController.deleteUser);
router.get('/student', userController.getMates);
router.use('/file', fileRoute);
router.use('/payment/method', paymentRoute);
router.get('/payment/redeem', redeemPoints);

export default router;

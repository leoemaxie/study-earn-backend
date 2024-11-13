import {Router} from 'express';
import * as userController from '@controllers/user.controller';
import * as paymentController from '@controllers/payment.controller';
import * as activityController from '@controllers/activity.controller';
import fileRoute from './user.file.route';
import paymentRoute from './payment.route';

const router = Router();

router.get('/profile', userController.getUserData);
router.patch('', userController.updateUserData);
router.delete('', userController.deleteUser);
router.get('/users', userController.getUsers);
router.post('/notification', userController.sendNotification);
router.post('/notification/token', userController.registerDeviceTokens);
router.use('/file', fileRoute);
router.use('/payment/method', paymentRoute);
router.get('/payment/redeem', paymentController.redeemPoints);
router.get('/payment/history', paymentController.getPaymentHistory);
router.get('/courses', userController.getCourses);
router.get('/activity', activityController.getActivities);
router.delete('/activity', activityController.deleteActivity);

export default router;

import {Router} from 'express';
import * as userController from '../controllers/user.controller';
import fileRoute from './user.file.route';

const router = Router();

router.get('/profile', userController.getUserData);
router.patch('/update', userController.updateUserData);
router.delete('/delete', userController.deleteUser);
router.get('/student', userController.getMates);
router.use('/file', fileRoute);

export default router;

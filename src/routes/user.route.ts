import {Router} from 'express';
import {
  deleteUserData,
  getMates,
  getUserData,
  updateUserData,
} from '../controllers/user.controller';
import fileRoute from './user.file.route';

const router = Router();

router.get('/', getUserData);
router.patch('/update', updateUserData);
router.delete('/delete', deleteUserData);
router.get('/student', getMates);
router.use('/file', fileRoute);

export default router;

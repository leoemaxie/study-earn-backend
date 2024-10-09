import {Router} from 'express';
import {deleteUserData, getStudents, getUserData, updateUserData} from '../controllers/user.controller';

const router = Router();

router.get('/', getUserData);
router.patch('/update', updateUserData);
router.delete('/delete', deleteUserData);
router.get('/students', getStudents);

export default router;

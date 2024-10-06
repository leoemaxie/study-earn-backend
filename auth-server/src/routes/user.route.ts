import {Router} from 'express';
import {deleteUser, getUser} from '../controllers/user.controller';

const router = Router();

router.get('/me', getUser);
router.delete('/delete', deleteUser);

export default router;

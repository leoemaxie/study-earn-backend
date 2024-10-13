import {Router} from 'express';
import * as SchoolController from '../controllers/school.controller';

const router = Router();

router.get('/departments', SchoolController.getDepartments);

export default router;

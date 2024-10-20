import {Router} from 'express';
import * as SchoolController from '@controllers/school.controller';

const router = Router();

router.get('/departments', SchoolController.getDepartments);
router.get('/faculty', SchoolController.getFaculty);
router.get('/calendar', SchoolController.getCalendar);

export default router;

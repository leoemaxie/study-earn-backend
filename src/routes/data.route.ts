import {Router} from 'express';
import * as dataController from '@controllers/data.controller';

const router = Router();

router.get('/business', dataController.getBusiness);
router.get('/announcement', dataController.getAnnouncement);
router.get('/events', dataController.getEvents);

export default router;

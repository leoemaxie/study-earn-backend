import {Router} from 'express';
import * as fileController from '../controllers/file.controller';

const router = Router();

router.get('/:type', fileController.downloadFile);

export default router;

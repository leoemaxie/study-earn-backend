import {Router} from 'express';
import {downloadFile} from '@controllers/file.controller';
import {Forbidden} from '@utils/error';
import * as studentController from '@controllers/student.controller';

const router = Router();

router.use((req, res, next) => {
  if (req.user?.role !== 'student') {
    next(new Forbidden('Access denied'));
  }
  next();
});

router.get('/study/download/:type/:name', downloadFile);
router.get('/scholarships', studentController.getScholarship);
router.post('/points', studentController.updatePoints);

export default router;

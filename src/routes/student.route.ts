import {Router} from 'express';
import * as scholarships from '../data/scholarship.json';
import {downloadFile} from '@controllers/file.controller';

const router = Router();

router.get('/scholarships', (req, res) => {
  res.status(200).json({data: [scholarships]});
});
router.get('/download/:type/:name', downloadFile);

export default router;

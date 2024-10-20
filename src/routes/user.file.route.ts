import {Request, Response, Router, NextFunction} from 'express';
import * as fileService from '../services/user.file.service';
import multer from 'multer';
import {BadRequest} from '@utils/error';

const storage = multer.memoryStorage();
const upload = multer({storage, limits: {fileSize: 1000000}});
const router = Router();

router.post(
  '/upload/:type',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params.type;

      if (!type) throw new BadRequest('No type provided');
      const data = await fileService.upload(req.file, req.user, type);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }
);

router.delete(
  '/delete/:type',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.params.type;

      await fileService.del(req.user, type, req.body?.fileName);
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  }
);

export default router;

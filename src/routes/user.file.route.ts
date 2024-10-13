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

router.get(
  '/download',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fileService.download(
        req.body.userId,
        req.body.fileName
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/delete',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fileService.del(req.body.userId, req.body.fileName);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/update',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await fileService.update(
        req.body.userId,
        req.body.fileName,
        req.file
      );
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

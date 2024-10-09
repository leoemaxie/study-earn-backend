import { Request, Response, NextFunction} from 'express';
import {upload} from '../services/file.service';

export async function uploadFile (req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({error: 'No file provided'});
    }

    const fileURL = upload(file, "")//req.user.id);

    return res.status(200).json({fileURL});
  } catch (error) {
    return next(error);
  }
}

import {Request, Response, NextFunction} from 'express';
import {download} from '@services/file.service';

export async function downloadFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {type, name} = req.params;
    const options = {
      semester: req.query.semester as string,
      session: req.query.session as string,
      markdown: req.query.markdown === 'true',
      list: req.query.list === 'true',
    };

    const data = await download(type, name, options);
    return res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
}

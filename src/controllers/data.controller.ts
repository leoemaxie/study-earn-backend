import business from '@data/business.json';
import announcement from '@data/announcement.json';
import events from '@data/events.json';
import {Request, Response, NextFunction} from 'express';
import {computeMetadata} from '@utils/pagination';
import {validateQuery} from '@utils/query';
import {DEFAULT_QUERY_FIELDS} from '@utils/fields';

export function getBusiness(req: Request, res: Response, next: NextFunction) {
  try {
    let {limit = 50, offset = 0, page} = req.query;

    validateQuery(req, DEFAULT_QUERY_FIELDS);

    if (page) {
      offset = (Number(page) - 1) * Number(limit);
    }

    const data = business.slice(Number(offset), Number(offset) + Number(limit));
    return res.status(200).json({
      metadata: computeMetadata(
        req,
        business.length,
        Number(limit),
        Number(offset)
      ),
      data,
    });
  } catch (error: unknown) {
    return next(error);
  }
}

export function getAnnouncement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let {limit = 50, offset = 0, page} = req.query;

    validateQuery(req, DEFAULT_QUERY_FIELDS);

    if (page) {
      offset = (Number(page) - 1) * Number(limit);
    }

    const data = announcement.slice(
      Number(offset),
      Number(offset) + Number(limit)
    );
    return res.status(200).json({
      metadata: computeMetadata(
        req,
        announcement.length,
        Number(limit),
        Number(offset)
      ),
      data,
    });
  } catch (error: unknown) {
    return next(error);
  }
}

export function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    let {limit = 50, offset = 0, page} = req.query;

    validateQuery(req, DEFAULT_QUERY_FIELDS);

    if (page) {
      offset = (Number(page) - 1) * Number(limit);
    }

    const data = events.slice(Number(offset), Number(offset) + Number(limit));
    return res.status(200).json({
      metadata: computeMetadata(
        req,
        events.length,
        Number(limit),
        Number(offset)
      ),
      data,
    });
  } catch (error: unknown) {
    return next(error);
  }
}

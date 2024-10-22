import {Request, Response, NextFunction} from 'express';
import * as business from '@data/business.json';
import * as announcement from '@data/announcement.json';
import * as events from '@data/events.json';

export function getBusiness(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({data: business});
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
    return res.status(200).json({data: announcement});
  } catch (error: unknown) {
    return next(error);
  }
}

export function getEvents(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).json({data: events});
  } catch (error: unknown) {
    return next(error);
  }
}

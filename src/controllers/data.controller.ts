import {Request, Response, NextFunction} from 'express';
import business from '@data/business.json';
import announcement from '@data/announcement.json';
import events from '@data/events.json';

export function getBusiness(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = {
      data: business,
    };
    return res.status(200).json(payload);
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

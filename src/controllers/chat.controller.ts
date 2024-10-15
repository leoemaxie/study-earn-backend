import {Request, Response, NextFunction} from 'express';
import {getChatHistory} from '@services/chat.service';

export class ChatController {
  public async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const {chatId, limit, offset} = req.query;
      const chatHistory = await getChatHistory(
        chatId as string,
        Number(limit),
        Number(offset)
      );
      res.status(200).json(chatHistory);
    } catch (error) {
      next(error);
    }
  }
}

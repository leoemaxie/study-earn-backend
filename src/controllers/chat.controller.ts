import {Request, Response, NextFunction} from 'express';
import {getChatHistory} from '@services/chat.service';
import {validateQuery} from '@utils/query';

export default class ChatController {
  public async getChatHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const {chatId, limit, offset} = req.query;

      validateQuery(req, {
        chatId: 'string',
        limit: 'number',
        offset: 'number',
      });

      const chatHistory = await getChatHistory(
        chatId as string,
        Number(limit),
        Number(offset)
      );
      res.status(200).json({data: chatHistory});
    } catch (error) {
      next(error);
    }
  }
}

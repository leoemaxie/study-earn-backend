import {Router} from 'express';
import ChatController from '@controllers/chat.controller';

const router = Router();
const chatController = new ChatController();

router.get('/history', chatController.getChatHistory);

export default router;

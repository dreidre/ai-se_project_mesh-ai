import { Router } from 'express';
import { createChat, getChats, getChat } from '../controllers/chats.js';
import { createMessage } from '../controllers/messages.js';
import { auth } from '../middleware/auth.js';

const chatsRouter = Router();

chatsRouter.use(auth);

chatsRouter.post('/', createChat);
chatsRouter.get('/', getChats);
chatsRouter.get('/:id', getChat);
chatsRouter.post('/:id/messages', createMessage);

export { chatsRouter };

import Chat, {IChat} from '@schemas/chat.schema';

export async function getChatHistory(
  chatId: string,
  limit: number,
  offset: number
): Promise<IChat[]> {
  return Chat.find({
    where: {chatId},
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
}

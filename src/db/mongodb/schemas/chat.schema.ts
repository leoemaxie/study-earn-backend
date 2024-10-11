import {Schema, model} from 'mongoose';
import Message, {IMessage} from './message.schema';

interface IChat {
  message: IMessage;
  sender: string;
  room: string;
}

const chatSchema = new Schema<IChat>({
  message: Message,
  sender: String,
  room: String,
});

export default model<IChat>('Chat', chatSchema);

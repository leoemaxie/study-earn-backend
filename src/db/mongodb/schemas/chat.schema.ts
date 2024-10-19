import {Schema, model} from 'mongoose';
import Message, {IMessage} from './message.schema';

export interface IChat {
  message: IMessage;
  sender: string;
  room: string;
}

const chatSchema = new Schema<IChat>({
  message: Message.schema,
  sender: String,
  room: String,
});

chatSchema.index({room: 1});

export default model<IChat>('Chat', chatSchema);

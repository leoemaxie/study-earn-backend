import {Schema, model} from 'mongoose';

export interface IMessage {
  message: string;
  sender: string;
  date: Date;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>({
  message: String,
  sender: String,
  date: Date,
  isRead: Boolean,
});

export default model<IMessage>('Message', messageSchema);

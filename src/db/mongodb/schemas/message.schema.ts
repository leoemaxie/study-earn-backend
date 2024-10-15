import {Schema, model} from 'mongoose';

export interface IMessage {
  message: string;
  senderId: string;
  chatId: Schema.Types.ObjectId,
  date: Date;
  readBy: [Schema.Types.ObjectId];
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>({
  message: String,
  chatId: Schema.Types.ObjectId,
  senderId: String,
  date: Date,
  readBy: [Schema.Types.ObjectId],
  isRead: Boolean,
});

messageSchema.index({ chatId: 1, date: -1 });
messageSchema.index({ date: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export default model<IMessage>('Message', messageSchema);

import {Schema, model} from 'mongoose';

export interface IMessage {
  message: string;
  senderId: Schema.Types.ObjectId;
  chatId: Schema.Types.ObjectId;
  readBy: [Schema.Types.ObjectId];
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    message: String,
    chatId: {type: Schema.Types.ObjectId, ref: 'Chat'},
    senderId: {type: Schema.Types.ObjectId, ref: 'User'},
    readBy: [Schema.Types.ObjectId],
    isRead: Boolean,
  },
  {timestamps: true}
);

messageSchema.index({chatId: 1, date: -1});
messageSchema.index({date: 1}, {expireAfterSeconds: 60 * 60 * 24 * 7});

export default model<IMessage>('Message', messageSchema);

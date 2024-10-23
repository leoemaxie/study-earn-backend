import {Schema, model} from 'mongoose';
import Message, {IMessage} from './message.schema';

export interface IChat {
  message: IMessage[];
  sender: Schema.Types.ObjectId;
  receipient: [Schema.Types.ObjectId];
  room?: string;
}

const chatSchema = new Schema<IChat>(
  {
    message: [Message.schema],
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    receipient: [{type: Schema.Types.ObjectId, ref: 'User'}],
    room: String,
  },
  {timestamps: true}
);

chatSchema.index({room: 1});

export default model<IChat>('Chat', chatSchema);

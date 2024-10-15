import {Schema, model} from 'mongoose';

export interface IRoom {
  name: string;
  description: string;
  users: [Schema.Types.ObjectId];
  createdAt: Date;
  picture?: string;
}

const roomSchema = new Schema<IRoom>({
  name: String,
  description: String,
  users: [Schema.Types.ObjectId],
  createdAt: Date,
  picture: String,
});

roomSchema.index({name: 1}, {unique: true});

export default model<IRoom>('Room', roomSchema);

import {Schema, model} from 'mongoose';

export interface IRoom {
  name: string;
  description: string;
  users: [Schema.Types.ObjectId];
  picture?: string;
}

const roomSchema = new Schema<IRoom>(
  {
    name: String,
    description: String,
    users: [{type: Schema.Types.ObjectId, ref: 'User'}],
    picture: String,
  },
  {timestamps: true}
);

roomSchema.index({name: 1}, {unique: true});

export default model<IRoom>('Room', roomSchema);

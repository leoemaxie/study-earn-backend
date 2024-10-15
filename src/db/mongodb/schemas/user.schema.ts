import {Schema, model} from 'mongoose';

export enum Status {
  online = 'online',
  offline = 'ofline',
  away = 'away',
}

interface IUser {
  id: string;
  picture?: string;
  name: string;
  email: string;
  role: string;
  status?: Status;
  lastActive?: Date;
}

const userSchema = new Schema<IUser>({
  id: String,
  picture: String,
  name: String,
  email: String,
  role: String,
  status: {
    type: String,
    enum: Object.values(Status),
  },
  lastActive: Date,
});

userSchema.index({email: 1}, {unique: true});

export default model<IUser>('User', userSchema);

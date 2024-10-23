import {Schema, model} from 'mongoose';

interface IUser {
  id: string;
  picture?: string;
  name: string;
  email: string;
  role: string;
  online?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    id: String,
    picture: String,
    name: String,
    email: String,
    role: String,
    online: Boolean,
  },
  {timestamps: true}
);

userSchema.index({email: 1}, {unique: true});

export default model<IUser>('User', userSchema);

import { Schema, model } from 'mongoose';

interface IUser {
    id: string;
    role: string;
}

const userSchema = new Schema<IUser>({
    id: String,
    role: String,
});

export default model<IUser>('User', userSchema);
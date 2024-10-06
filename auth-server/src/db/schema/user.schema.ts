import {Schema, model} from 'mongoose';
import {randomUUID} from 'crypto';
import bcrypt from 'bcrypt';

export interface IUser {
  sub: Schema.Types.UUID;
  email: string;
  password: string;
  role: string;
}

const UserSchema = new Schema<IUser>({
  sub: {type: Schema.Types.UUID, required: true, default: () => randomUUID()},
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    validate: {
      validator: function (v: string) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          v
        );
      },
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  },
  role: {
    type: String,
    required: true,
    enum: {values: ['student', 'staff', 'admin'], message: 'Invalid role'},
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: 'Invalid email address',
    },
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = model<IUser>('User', UserSchema);

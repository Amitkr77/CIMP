import mongoose, { Schema, Document } from 'mongoose';
import { Role } from '@/lib/auth';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['incubatee', 'manager', 'ceo'],
      default: 'incubatee',
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  applicationId?: Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title:         { type: String, required: true },
    message:       { type: String, required: true },
    type:          { type: String, enum: ['info','success','warning','error'], default: 'info' },
    read:          { type: Boolean, default: false },
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema);

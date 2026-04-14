import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  applicationId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderName: string;
  senderRole: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    senderId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderName:    { type: String, required: true },
    senderRole:    { type: String, required: true },
    content:       { type: String, required: true },
    read:          { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema);

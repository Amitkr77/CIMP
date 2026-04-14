import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IActivity extends Document {
  applicationId: Types.ObjectId;
  actorName: string;
  actorRole: string;
  action: string;
  detail?: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    actorName:     { type: String, required: true },
    actorRole:     { type: String, required: true },
    action:        { type: String, required: true },
    detail:        { type: String },
  },
  { timestamps: true }
);

export const Activity =
  mongoose.models.Activity ||
  mongoose.model<IActivity>('Activity', ActivitySchema);

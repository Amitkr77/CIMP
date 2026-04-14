import mongoose, { Schema, Document, Types } from 'mongoose';

export type AppStatus = 'pending' | 'approved' | 'rejected';
export type AppStage = 'submitted' | 'manager_reviewed' | 'manager_approved' | 'ceo_approved' | 'rejected';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  applicantName: string;
  startupName: string;
  idea: string;
  industry: string;
  pitchDeckUrl?: string;
  pitchDeckName?: string;
  status: AppStatus;
  stage: AppStage;
  managerId?: Types.ObjectId;
  managerNote?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  isFastTracked: boolean;
  isPublic: boolean;
  isEditable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
    applicantName: { type: String, required: true },
    startupName:   { type: String, required: true, trim: true },
    idea:          { type: String, required: true },
    industry:      { type: String, required: true },
    pitchDeckUrl:  { type: String },
    pitchDeckName: { type: String },
    status:        { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
    stage:         { type: String, enum: ['submitted','manager_reviewed','manager_approved','ceo_approved','rejected'], default: 'submitted' },
    managerId:     { type: Schema.Types.ObjectId, ref: 'User' },
    managerNote:   { type: String },
    rejectedBy:    { type: String },
    rejectionReason:{ type: String },
    isFastTracked: { type: Boolean, default: false },
    isPublic:      { type: Boolean, default: false },
    isEditable:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Application =
  mongoose.models.Application ||
  mongoose.model<IApplication>('Application', ApplicationSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IIssue extends Document {
  reportId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'UNDER REVIEW' | 'VERIFIED' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED' | 'CLOSED';
  userId: mongoose.Types.ObjectId;
  imageUrl?: string;
  frequency?: string;
  landmark?: string;
  createdAt: Date;
  resolvedAt?: Date | null;
}

const issueSchema = new Schema<IIssue>(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please describe the problem'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify an issue category'],
      enum: [
        'Pothole',
        'Streetlight',
        'Garbage',
        'Water Leakage',
        'Drainage',
        'Road Damage',
        'Public Toilet',
        'Traffic Signal',
        'Park/Public Space',
        'Other',
      ],
    },
    location: {
      type: String,
      required: [true, 'Please provide the issue location'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: [
        'REPORTED',
        'UNDER REVIEW',
        'VERIFIED',
        'ASSIGNED',
        'IN PROGRESS',
        'RESOLVED',
        'CLOSED',
      ],
      default: 'REPORTED',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    frequency: {
      type: String,
      default: null,
    },
    landmark: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

export const Issue = mongoose.models.Issue || mongoose.model<IIssue>('Issue', issueSchema);

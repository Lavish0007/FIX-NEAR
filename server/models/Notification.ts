import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  type: 'STATUS_UPDATE' | 'COMMENT' | 'SYSTEM';
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['STATUS_UPDATE', 'COMMENT', 'SYSTEM'],
      default: 'SYSTEM',
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const Notification =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);

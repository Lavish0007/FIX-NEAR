import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  issueId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  message: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    issueId: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Comment message cannot be empty'],
      trim: true,
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

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);

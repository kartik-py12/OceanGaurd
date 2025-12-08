import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailNotification extends Document {
  reportId: mongoose.Types.ObjectId;
  type: string;
  location: {
    lat: number;
    lng: number;
  };
  sentAt: Date;
  emailSent: boolean;
}

const EmailNotificationSchema: Schema = new Schema({
  reportId: {
    type: Schema.Types.ObjectId,
    ref: 'HazardReport',
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  emailSent: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

EmailNotificationSchema.index({ type: 1, 'location.lat': 1, 'location.lng': 1 });

export default mongoose.model<IEmailNotification>('EmailNotification', EmailNotificationSchema);


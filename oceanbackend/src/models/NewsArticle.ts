import mongoose, { Schema, Document } from 'mongoose';

export interface INewsArticle extends Document {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: Date;
  source: 'hazard-report' | 'rss-feed';
  verificationStatus?: 'unverified' | 'ai-verified' | 'admin-verified';
  sourceUrl?: string;
  hazardReportId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NewsArticleSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Oil Spill', 'Debris', 'Pollution', 'Climate', 'Weather', 'Geological', 'Other'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now,
  },
  source: {
    type: String,
    required: [true, 'Source is required'],
    enum: ['hazard-report', 'rss-feed'],
    default: 'hazard-report',
  },
  verificationStatus: {
    type: String,
    enum: ['unverified', 'ai-verified', 'admin-verified'],
    default: null,
  },
  sourceUrl: {
    type: String,
    default: null,
  },
  hazardReportId: {
    type: Schema.Types.ObjectId,
    ref: 'HazardReport',
    default: null,
  },
}, {
  timestamps: true,
});

export default mongoose.model<INewsArticle>('NewsArticle', NewsArticleSchema);


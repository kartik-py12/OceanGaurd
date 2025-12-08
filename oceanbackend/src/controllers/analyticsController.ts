import { Request, Response } from 'express';
import HazardReport from '../models/HazardReport';

export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalReports = await HazardReport.countDocuments();
    const verifiedReports = await HazardReport.countDocuments({ verified: true });
    const avgSeverity = await HazardReport.aggregate([
      { $group: { _id: null, avgSeverity: { $avg: '$severity' } } },
    ]);

    const reportsByType = await HazardReport.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const severityDistribution = await HazardReport.aggregate([
      {
        $bucket: {
          groupBy: '$severity',
          boundaries: [0, 4, 7, 9, 11],
          default: 'other',
          output: { count: { $sum: 1 } },
        },
      },
    ]);

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const reportsOverTime = await HazardReport.aggregate([
      { $match: { createdAt: { $gte: fourWeeksAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      message: 'Analytics retrieved successfully',
      data: {
        totalReports,
        verifiedReports,
        avgSeverity: avgSeverity[0]?.avgSeverity || 0,
        reportsByType,
        severityDistribution,
        reportsOverTime,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error retrieving analytics' });
  }
};


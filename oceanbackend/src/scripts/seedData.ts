import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HazardReport from '../models/HazardReport';
import NewsArticle from '../models/NewsArticle';
import User from '../models/User';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/oceanguard');
    console.log('Connected to MongoDB');

    await HazardReport.deleteMany({});
    await NewsArticle.deleteMany({});
    console.log('Cleared existing data');

    let testUser = await User.findOne({ email: 'test@oceanguard.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Test User',
        email: 'test@oceanguard.com',
        password: 'test123',
      });
      console.log('Created test user');
    }

    const hazardReports = [
      {
        type: 'Debris',
        location: { lat: 30.0, lng: -140.0 },
        severity: 8,
        description: 'Large cluster of plastic and fishing net debris, part of the Great Pacific Garbage Patch.',
        reportedBy: testUser._id,
        verified: true,
        imageUrl: 'https://picsum.photos/seed/debris1/400/300',
      },
      {
        type: 'Oil Spill',
        location: { lat: 28.7, lng: -89.5 },
        severity: 9,
        description: 'Significant oil slick spotted in the Gulf of Mexico.',
        reportedBy: testUser._id,
        verified: true,
        imageUrl: 'https://picsum.photos/seed/oilspill1/400/300',
      },
      {
        type: 'Pollution',
        location: { lat: 20.0, lng: 90.0 },
        severity: 6,
        description: 'Chemical runoff causing discolored water in the Bay of Bengal.',
        reportedBy: testUser._id,
        verified: false,
        imageUrl: 'https://picsum.photos/seed/pollution1/400/300',
      },
    ];

    await HazardReport.insertMany(hazardReports);
    console.log('Seeded hazard reports');

    const newsArticles = [
      {
        title: 'Detected Off Coast',
        summary: 'An oil tanker has run aground, causing a significant spill that threatens local marine ecosystems.',
        imageUrl: 'https://picsum.photos/seed/news1/400/300',
        category: 'Oil Spill',
        date: new Date('2023-10-26'),
      },
      {
        title: 'Algal Bloom Spreads',
        summary: 'A massive harmful algal bloom is rapidly expanding, causing \'dead zones\' and impacting marine life.',
        imageUrl: 'https://picsum.photos/seed/news2/400/300',
        category: 'Pollution',
        date: new Date('2023-10-25'),
      },
      {
        title: 'Coral Bleaching Worsens',
        summary: 'Experts warn of an expanding mass bleaching event on record due to rising sea temperatures.',
        imageUrl: 'https://picsum.photos/seed/news3/400/300',
        category: 'Climate',
        date: new Date('2023-10-24'),
      },
      {
        title: 'Closed Due to Iceberg',
        summary: 'A major shipping lane in the north Atlantic has been temporarily closed due to a massive drifting iceberg.',
        imageUrl: 'https://picsum.photos/seed/news4/400/300',
        category: 'Other',
        date: new Date('2023-10-23'),
      },
      {
        title: 'Hurricane Upgraded to Category 5',
        summary: 'Coastal residents are on high alert as a hurricane intensifies, posing a severe threat.',
        imageUrl: 'https://picsum.photos/seed/news5/400/300',
        category: 'Weather',
        date: new Date('2023-10-22'),
      },
      {
        title: 'After Undersea Quake',
        summary: 'An 8.2 magnitude undersea earthquake has triggered a tsunami warning for several Pacific islands.',
        imageUrl: 'https://picsum.photos/seed/news6/400/300',
        category: 'Geological',
        date: new Date('2023-10-21'),
      },
      {
        title: 'Plastic Debris Field Discovered',
        summary: 'A new, massive field of plastic debris, larger than Texas, has been identified in the South Pacific Gyre.',
        imageUrl: 'https://picsum.photos/seed/news7/400/300',
        category: 'Debris',
        date: new Date('2023-10-20'),
      },
      {
        title: 'Levels Reach Critical Point',
        summary: 'New data shows ocean acidification has reached a critical point, threatening shelled populations globally.',
        imageUrl: 'https://picsum.photos/seed/news8/400/300',
        category: 'Pollution',
        date: new Date('2023-10-19'),
      },
    ];

    await NewsArticle.insertMany(newsArticles);
    console.log('Seeded news articles');

    console.log(' Seed data created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();


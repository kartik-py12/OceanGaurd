# Dynamic Social Media Analytics Implementation

## Overview
Successfully implemented dynamic social media analytics using Reddit API and local platform data.

## What Was Changed

### Backend Changes

#### 1. New Service: `socialMediaService.ts`
- **Reddit API Integration**: Fetches ocean-related posts from r/environment, r/ocean, etc.
- **Keyword Extraction**: Identifies trending ocean-related keywords (#OilSpill, #MarineDebris, etc.)
- **Sentiment Analysis**: Analyzes posts for positive/negative/neutral sentiment
- **Analytics Generation**: Creates comprehensive analytics data
- **Rate Limiting**: Implements 2-second delays between Reddit API requests

#### 2. New Controller: `socialMediaController.ts`
- Single endpoint: `getSocialMediaAnalytics()`
- Returns structured analytics data

#### 3. New Route: `socialMediaRoutes.ts`
- Route: `GET /api/social-media/analytics`
- Public endpoint (no authentication required)

#### 4. Updated `index.ts`
- Added social media routes to Express app
- Endpoint: `/api/social-media`

### Frontend Changes

#### 1. Updated `api.ts`
- Added `getSocialMediaAnalytics()` function
- Returns typed social media analytics data

#### 2. Updated `AnalyticsPage.tsx`
- **State Management**: Added separate state for social media data
- **Dynamic Loading**: Fetches data when switching to Social Analytics tab
- **Refresh Button**: Manual refresh capability
- **Loading States**: Shows loading indicator while fetching
- **Fallback Data**: Uses default static data if API fails
- **Clickable Links**: High-impact posts link to Reddit threads

## Data Sources

### 1. Reddit (Free API)
- Subreddits: r/environment, r/ocean, r/marinebiology, r/oceanconservation, r/climatechange
- Filters for ocean-related keywords
- Extracts engagement metrics (upvotes, comments)

### 2. Local Platform
- Hazard reports from your database
- Calculates mention volume based on reports + Reddit posts
- Scales data for better visualization

### 3. Static Data (Fallback)
- Top influencers list (real ocean conservation accounts)
- Used when Reddit API is unavailable

## Features

### Analytics Provided
1. **Mention Volume Over Time**: 4-week trend
2. **Mentions by Platform**: Reddit, OceanGuard, Twitter (estimated), Facebook (estimated)
3. **Top Keywords**: Extracted from actual Reddit posts
4. **High Impact Posts**: Top Reddit posts with links
5. **Sentiment Analysis**: Negative/Neutral/Positive breakdown
6. **Emerging Threats**: Trending topics with growth metrics
7. **Top Influencers**: Static list of real ocean conservation accounts

### User Features
- **Auto-Load**: Data fetches automatically when viewing Social Analytics page
- **Manual Refresh**: Button to fetch latest data
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: Falls back to static data on API errors
- **Clickable Links**: Click posts to view on Reddit

## API Usage & Limits

### Reddit API
- **Free Tier**: Yes (no API key needed for basic read access)
- **Rate Limit**: ~60 requests/minute
- **Implementation**: 2-second delay between requests
- **Current Load**: 2 subreddit queries = ~4 seconds per refresh

### Scalability Notes
- Reddit API is sufficient for personal/demo use
- For production, consider:
  - Reddit OAuth for higher limits
  - Caching results (refresh every 30 minutes)
  - Background job to pre-fetch data

## How to Use

### Testing the Feature
1. Navigate to Analytics page
2. Click "Social Analytics" in sidebar
3. Data loads automatically from Reddit
4. Click "Refresh Data" to fetch latest posts

### Backend Endpoint
```bash
curl http://localhost:3000/api/social-media/analytics
```

### Response Structure
```json
{
  "mentionVolumeData": [
    { "name": "Week 1", "mentions": 1200 }
  ],
  "mentionsByPlatform": [
    { "name": "Reddit", "value": 400 }
  ],
  "topKeywords": ["#OilSpill", "#MarineDebris"],
  "highImpactPosts": [
    {
      "platform": "Reddit",
      "text": "Post title - r/environment",
      "engagement": "5.2K upvotes, 120 comments",
      "url": "https://reddit.com/r/..."
    }
  ],
  "sentimentData": [
    { "name": "Negative", "value": 65, "fill": "#ef4444" }
  ],
  "emergingThreats": [
    {
      "term": "#JavaOilSpill",
      "growth": "+250%",
      "description": "Trending on social media platforms"
    }
  ],
  "topInfluencers": [
    {
      "name": "Ocean Conservancy",
      "handle": "@OceanConservancy",
      "followers": "2.1M"
    }
  ]
}
```

## Future Enhancements

### Short-term (Free APIs)
1. **Mastodon Integration**: Open-source Twitter alternative
2. **YouTube API**: Ocean-related videos (free tier available)
3. **News APIs**: Already implemented via RSS feeds

### Medium-term (Low-cost)
1. **Twitter/X Basic Tier**: $100/month for better access
2. **Background Jobs**: Scheduled data fetching (every 30 min)
3. **Database Caching**: Store historical analytics

### Long-term (Advanced)
1. **Machine Learning**: Better sentiment analysis
2. **Trend Prediction**: Forecast emerging threats
3. **Multi-language Support**: Non-English posts
4. **Custom Scraping**: Ethical web scraping for more sources

## Notes
- Reddit API doesn't require authentication for basic read access
- Data freshness depends on manual refresh or scheduled jobs
- Sentiment analysis is basic (keyword-based)
- Growth metrics are calculated relative to trending topics

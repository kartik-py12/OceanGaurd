import Parser from 'rss-parser';
import NewsArticle from '../models/NewsArticle';

const parser = new Parser();

interface RSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
}

// Google News RSS feeds for ocean-related topics
const RSS_FEEDS = [
  'https://news.google.com/rss/search?q=ocean+pollution&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=ocean+hazard&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=oil+spill&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=marine+debris&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=ocean+conservation&hl=en-US&gl=US&ceid=US:en',
  'https://news.google.com/rss/search?q=marine+pollution&hl=en-US&gl=US&ceid=US:en',
];

const categorizeArticle = (title: string, content: string): string => {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();
  const combined = lowerTitle + ' ' + lowerContent;

  if (combined.includes('oil spill') || combined.includes('oil leak')) {
    return 'Oil Spill';
  } else if (combined.includes('debris') || combined.includes('plastic') || combined.includes('waste')) {
    return 'Debris';
  } else if (combined.includes('pollution') || combined.includes('contamination')) {
    return 'Pollution';
  } else if (combined.includes('climate') || combined.includes('warming')) {
    return 'Climate';
  } else if (combined.includes('weather') || combined.includes('storm') || combined.includes('hurricane')) {
    return 'Weather';
  }
  return 'Other';
};

const generateSummary = (content: string, maxLength: number = 200): string => {
  if (!content) return 'No summary available';
  
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  // Truncate to max length
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength).trim() + '...';
};

const getRandomOceanImage = (): string => {
  const oceanImages = [
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&h=600&fit=crop',
  ];
  return oceanImages[Math.floor(Math.random() * oceanImages.length)];
};

export const fetchAndStoreRSSFeeds = async (): Promise<{ success: number; failed: number }> => {
  let successCount = 0;
  let failedCount = 0;

  console.log('🔄 Starting RSS feed fetch...');

  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching feed: ${feedUrl}`);
      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items as RSSItem[]) {
        try {
          if (!item.title || !item.link) {
            continue;
          }

          // Check if article already exists by source URL
          const existing = await NewsArticle.findOne({ sourceUrl: item.link });
          if (existing) {
            continue;
          }

          const content = item.contentSnippet || item.content || '';
          const category = categorizeArticle(item.title, content);
          const summary = generateSummary(content);
          const pubDate = item.isoDate || item.pubDate || new Date().toISOString();

          await NewsArticle.create({
            title: item.title,
            summary,
            imageUrl: getRandomOceanImage(),
            category,
            date: new Date(pubDate),
            source: 'rss-feed',
            sourceUrl: item.link,
            verificationStatus: null,
          });

          successCount++;
          console.log(`✅ Added article: ${item.title.substring(0, 50)}...`);
        } catch (error) {
          failedCount++;
          console.error(`❌ Failed to save article: ${item.title}`, error);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fetch feed: ${feedUrl}`, error);
      failedCount++;
    }
  }

  console.log(`✅ RSS feed fetch complete: ${successCount} added, ${failedCount} failed`);
  return { success: successCount, failed: failedCount };
};

export const fetchRSSFeedsForCategory = async (category: string): Promise<{ success: number; failed: number }> => {
  const categoryFeeds: { [key: string]: string } = {
    'Oil Spill': 'https://news.google.com/rss/search?q=oil+spill&hl=en-US&gl=US&ceid=US:en',
    'Debris': 'https://news.google.com/rss/search?q=marine+debris+ocean&hl=en-US&gl=US&ceid=US:en',
    'Pollution': 'https://news.google.com/rss/search?q=ocean+pollution&hl=en-US&gl=US&ceid=US:en',
    'Climate': 'https://news.google.com/rss/search?q=ocean+climate+change&hl=en-US&gl=US&ceid=US:en',
  };

  const feedUrl = categoryFeeds[category] || RSS_FEEDS[0];
  let successCount = 0;
  let failedCount = 0;

  try {
    const feed = await parser.parseURL(feedUrl);

    for (const item of feed.items as RSSItem[]) {
      try {
        if (!item.title || !item.link) {
          continue;
        }

        const existing = await NewsArticle.findOne({ sourceUrl: item.link });
        if (existing) {
          continue;
        }

        const content = item.contentSnippet || item.content || '';
        const summary = generateSummary(content);
        const pubDate = item.isoDate || item.pubDate || new Date().toISOString();

        await NewsArticle.create({
          title: item.title,
          summary,
          imageUrl: getRandomOceanImage(),
          category: category,
          date: new Date(pubDate),
          source: 'rss-feed',
          sourceUrl: item.link,
          verificationStatus: null,
        });

        successCount++;
      } catch (error) {
        failedCount++;
      }
    }
  } catch (error) {
    failedCount++;
  }

  return { success: successCount, failed: failedCount };
};

import { Router } from 'express';
import { getNewsArticles, createNewsArticle, syncRSSFeeds } from '../controllers/newsController';

const router = Router();

router.get('/', getNewsArticles);
router.post('/', createNewsArticle);
router.post('/sync-rss', syncRSSFeeds);

export default router;


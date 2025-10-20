import express from 'express';
import { NewsFeedControllers } from './newsfeed.controller';

const router = express.Router();

// Get endpoints
router.get('/', NewsFeedControllers.getAllNews);
router.get('/popular', NewsFeedControllers.getPopularNews);
router.get('/trending', NewsFeedControllers.getTrendingNews);
router.get('/stats', NewsFeedControllers.getStatistics);
router.get('/source/:source', NewsFeedControllers.getNewsBySource);

// Post endpoints
router.post('/refresh', NewsFeedControllers.refreshNews);
router.post('/refresh/:source', NewsFeedControllers.refreshNews);
router.post('/update-scores', NewsFeedControllers.updateScores);

// Tracking endpoints
router.post('/:id/view', NewsFeedControllers.trackNewsView);
router.post('/:id/click', NewsFeedControllers.trackNewsClick);
router.post('/:id/bookmark', NewsFeedControllers.trackNewsBookmark);
router.post('/:id/share', NewsFeedControllers.trackNewsShare);

export const NewsFeedRoutes = router;
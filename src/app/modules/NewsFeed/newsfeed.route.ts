import express from 'express';
import { NewsFeedControllers } from './newsfeed.controller';

const router = express.Router();

router.get('/', NewsFeedControllers.getAllNews);

router.get('/source/:source', NewsFeedControllers.getNewsBySource);

router.post('/refresh', NewsFeedControllers.refreshNews);

export const NewsFeedRoutes = router;
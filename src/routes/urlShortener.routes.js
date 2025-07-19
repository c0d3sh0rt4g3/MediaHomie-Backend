import { Router } from 'express';
import urlShortenerController from '../controllers/urlShortener.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// Public route
router.get('/:shortId', urlShortenerController.redirectToOriginalUrl);

// 🔐 Protected routes (require logged-in user)
router.post('/shorten', authenticateToken, urlShortenerController.createShortUrl);
router.get('/', authenticateToken, urlShortenerController.getAllShortenedUrls);
router.get('/sort/user', authenticateToken, urlShortenerController.getUserShortenedUrls); // <- ✅ Preferred user-only route
router.delete('/:id', authenticateToken, urlShortenerController.deleteShortenedUrl);

export default router;

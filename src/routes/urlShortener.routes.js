import { Router } from 'express';
import urlShortenerController from "../controllers/urlShortener.controller.js";

const router = Router();

const commonHeader = "/url"

router.post('/shorten', urlShortenerController.createShortUrl);
router.get('/:shortId', urlShortenerController.redirectToOriginalUrl);
router.get('/', urlShortenerController.getAllShortenedUrls);
router.delete('/:id', urlShortenerController.deleteShortenedUrl);

export default router;

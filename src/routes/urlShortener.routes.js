import { Router } from 'express';
import urlShortenerController from "../controllers/urlShortener.controller.js";

const router = Router();

router.post('/url/shorten', urlShortenerController.createShortUrl);
router.get('/:shortId', urlShortenerController.redirectToOriginalUrl);

export default router;

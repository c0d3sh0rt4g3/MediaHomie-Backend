import UrlShortener from '../models/urlShortener.model.js';
import { nanoid } from 'nanoid';

const urlShortenerController = {
  /**
   * Create a new short URL
   */
  createShortUrl: async (req, res) => {
    try {
      const { originalUrl, expiresAt } = req.body;
      const owner = req.user?.id;

      if (!originalUrl || !/^https?:\/\/.+/i.test(originalUrl)) {
        return res.status(400).json({ message: 'Invalid or missing originalUrl.' });
      }

      // Generate a unique short ID
      let shortId;
      let exists = true;
      while (exists) {
        shortId = nanoid(7);
        exists = await UrlShortener.findOne({ shortId });
      }

      const newShortUrl = new UrlShortener({
        originalUrl,
        shortId,
        owner,
        expiresAt: expiresAt || null,
      });

      await newShortUrl.save();

      return res.status(201).json({
        message: 'Short URL created successfully',
        shortUrl: `${req.protocol}://${req.get('host')}/url/${shortId}`,
        shortId,
        originalUrl
      });

    } catch (error) {
      console.error('Error creating short URL:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Redirect request to the original URL
   */
  redirectToOriginalUrl: async (req, res) => {
    try {
      const { shortId } = req.params;

      const shortUrl = await UrlShortener.findOne({ shortId });
      if (!shortUrl) {
        return res.status(404).json({ message: 'Short URL not found' });
      }

      if (shortUrl.expiresAt && new Date() > shortUrl.expiresAt) {
        return res.status(410).json({ message: 'This short URL has expired.' });
      }

      shortUrl.clicks++;
      await shortUrl.save();

      return res.redirect(shortUrl.originalUrl);

    } catch (error) {
      console.error('Error during redirect:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  /**
   * Get all shortened urls
   * */
  getAllShortenedUrls: async (req, res) => {
    try {
      const shortenedUrls = await UrlShortener.find({});

      res.status(200).json({ shortenedUrls });
    } catch (error) {
      console.error('Error fetching shortened urls:', error);
      res.status(500).json({ message: 'Server error while fetching shortened urls' });
    }
  },

  /**
   * Delete a specified shortened url
   * */
  deleteShortenedUrl: async (req, res) => {
    try {
      const { id } = req.params;

      const urlShortener = await UrlShortener.findByIdAndDelete(id);
      if (!urlShortener) {
        return res.status(404).json({ message: 'Shortened url not found' });
      }

      res.status(200).json({ message: 'Shortened url deleted successfully' });
    } catch (error) {
      console.error('Error deleting shortened url:', error);
      res.status(500).json({ message: 'Server error while deleting shortened url' });
    }
  },
  /**
  * Get all shortened URLs by user ID
  */
  getUserShortenedUrls: async (req, res) => {
    try {
      const ownerId = req.user?.id;

      if (!ownerId) {
        return res.status(401).json({ message: 'Unauthorized: User ID not found in request' });
      }

      const userUrls = await UrlShortener.find({ owner: ownerId });

      res.status(200).json({ shortenedUrls: userUrls });
    } catch (error) {
      console.error('Error fetching user shortened urls:', error);
      res.status(500).json({ message: 'Server error while fetching user shortened urls' });
    }
  }
};

export default urlShortenerController;

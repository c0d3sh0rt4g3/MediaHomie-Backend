import mongoose from "mongoose";

const urlShortenerSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  originalUrl: String,
  shortId: { type: String, unique: true, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const UrlShortener = mongoose.model('UrlShortener', urlShortenerSchema);

export default UrlShortener;
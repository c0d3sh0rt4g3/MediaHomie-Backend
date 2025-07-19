import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalName: String,
  type: String,
  storagePath: String,
  size: Number,
  createdAt: { type: Date, default: Date.now },
  meta: mongoose.Schema.Types.Mixed
});

const FileSchema = mongoose.model('FileSchema', fileSchema);

export default FileSchema;
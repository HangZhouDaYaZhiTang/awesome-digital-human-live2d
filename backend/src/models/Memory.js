const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['short_term', 'long_term'], required: true },
  content: { type: String, required: true },
  summary: String,
  importance: { type: Number, default: 1, min: 1, max: 10 },
  tags: [String],
  embedding: [Number],
  conversationId: String,
  createdAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now },
  accessCount: { type: Number, default: 0 }
});

memorySchema.index({ userId: 1, type: 1 });
memorySchema.index({ userId: 1, embedding: 1 });

module.exports = mongoose.model('Memory', memorySchema);

const Memory = require('../models/Memory');
const BailianService = require('./BailianService');

class MemoryService {
  constructor() {
    this.bailianService = new BailianService();
    this.shortTermLimit = 50;
    this.longTermThreshold = 7;
  }

  async addShortTermMemory(userId, content, conversationId) {
    try {
      const embedding = await this.bailianService.generateEmbedding(content);
      
      const memory = new Memory({
        userId,
        type: 'short_term',
        content,
        embedding,
        conversationId,
        importance: this.calculateImportance(content)
      });

      await memory.save();
      
      await this.cleanupShortTermMemories(userId);
      
      return memory;
    } catch (error) {
      throw new Error(`Failed to add short-term memory: ${error.message}`);
    }
  }

  async promoteToLongTermMemory(userId) {
    try {
      const oldMemories = await Memory.find({
        userId,
        type: 'short_term',
        createdAt: { $lt: new Date(Date.now() - this.longTermThreshold * 24 * 60 * 60 * 1000) }
      }).sort({ importance: -1, accessCount: -1 });

      for (const memory of oldMemories) {
        const summary = await this.generateMemorySummary(memory.content);
        
        const longTermMemory = new Memory({
          userId: memory.userId,
          type: 'long_term',
          content: memory.content,
          summary,
          embedding: memory.embedding,
          importance: memory.importance,
          tags: this.extractTags(memory.content),
          conversationId: memory.conversationId
        });

        await longTermMemory.save();
        await Memory.findByIdAndDelete(memory._id);
      }
    } catch (error) {
      throw new Error(`Failed to promote memories: ${error.message}`);
    }
  }

  async searchRelevantMemories(userId, query, limit = 5) {
    try {
      const queryEmbedding = await this.bailianService.generateEmbedding(query);
      
      const memories = await Memory.find({ userId });
      const scoredMemories = memories.map(memory => ({
        memory,
        score: this.cosineSimilarity(queryEmbedding, memory.embedding)
      })).sort((a, b) => b.score - a.score).slice(0, limit);

      for (const item of scoredMemories) {
        await Memory.findByIdAndUpdate(item.memory._id, {
          $inc: { accessCount: 1 },
          lastAccessed: new Date()
        });
      }

      return scoredMemories.map(item => item.memory);
    } catch (error) {
      throw new Error(`Failed to search memories: ${error.message}`);
    }
  }

  async generateMemorySummary(content) {
    try {
      const messages = [
        {
          role: 'system',
          content: '你是一个记忆摘要助手。请将用户的对话内容总结成简洁的要点，保留重要信息。'
        },
        {
          role: 'user',
          content: `请总结以下对话内容：\n${content}`
        }
      ];

      const response = await this.bailianService.chatCompletion(messages);
      return response.choices[0].message.content;
    } catch (error) {
      return content.substring(0, 200) + '...';
    }
  }

  calculateImportance(content) {
    let score = 1;
    if (content.includes('重要') || content.includes('记住')) score += 2;
    if (content.includes('?') || content.includes('？')) score += 1;
    if (content.length > 100) score += 1;
    return Math.min(score, 10);
  }

  extractTags(content) {
    const commonTags = ['工作', '学习', '生活', '情感', '计划', '问题'];
    return commonTags.filter(tag => content.includes(tag));
  }

  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async cleanupShortTermMemories(userId) {
    const count = await Memory.countDocuments({ userId, type: 'short_term' });
    if (count > this.shortTermLimit) {
      const excess = count - this.shortTermLimit;
      const oldestMemories = await Memory.find({ userId, type: 'short_term' })
        .sort({ lastAccessed: 1, importance: 1 })
        .limit(excess);
      
      for (const memory of oldestMemories) {
        await Memory.findByIdAndDelete(memory._id);
      }
    }
  }
}

module.exports = MemoryService;

const express = require('express');
const auth = require('../middleware/auth');
const MultiAgentService = require('../services/MultiAgentService');
const MemoryService = require('../services/MemoryService');

const router = express.Router();
const multiAgentService = new MultiAgentService();
const memoryService = new MemoryService();

router.post('/message', auth, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id;

    const result = await multiAgentService.processWithMultipleExperts(
      userId,
      message,
      conversationId
    );

    res.json({
      response: result.response,
      emotion: result.emotion,
      conversationId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/memories', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { query, limit = 10 } = req.query;

    let memories;
    if (query) {
      memories = await memoryService.searchRelevantMemories(userId, query, parseInt(limit));
    } else {
      const Memory = require('../models/Memory');
      memories = await Memory.find({ userId })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));
    }

    res.json({ memories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

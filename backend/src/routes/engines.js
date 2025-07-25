const express = require('express');
const EngineFactory = require('../services/EngineFactory');
const auth = require('../middleware/auth');

const router = express.Router();
const engineFactory = new EngineFactory();

router.get('/asr/v0/engine', (req, res) => {
  try {
    const engines = engineFactory.listEngines('asr');
    res.json({
      success: true,
      data: engines,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.get('/asr/v0/engine/default', (req, res) => {
  try {
    const defaultEngine = engineFactory.getDefaultEngine('asr');
    res.json({
      success: true,
      data: defaultEngine,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: '',
      error: error.message
    });
  }
});

router.get('/asr/v0/engine/:engine', (req, res) => {
  try {
    const { engine } = req.params;
    const parameters = engineFactory.getEngineParameters('asr', engine);
    res.json({
      success: true,
      data: parameters,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.post('/asr/v0/engine', auth, async (req, res) => {
  try {
    const { engine = 'default', data, config = {} } = req.body;
    const engineName = engine === 'default' ? engineFactory.getDefaultEngine('asr') : engine;
    const asrEngine = await engineFactory.createEngineInstance('asr', engineName, config);
    
    const result = await asrEngine.speechToText(data, config);
    res.json({
      success: true,
      data: result,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: '',
      error: error.message
    });
  }
});

router.get('/tts/v0/engine', (req, res) => {
  try {
    const engines = engineFactory.listEngines('tts');
    res.json({
      success: true,
      data: engines,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.get('/tts/v0/engine/default', (req, res) => {
  try {
    const defaultEngine = engineFactory.getDefaultEngine('tts');
    res.json({
      success: true,
      data: defaultEngine,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: '',
      error: error.message
    });
  }
});

router.get('/tts/v0/engine/:engine', (req, res) => {
  try {
    const { engine } = req.params;
    const parameters = engineFactory.getEngineParameters('tts', engine);
    res.json({
      success: true,
      data: parameters,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.get('/tts/v0/engine/:engine/voice', async (req, res) => {
  try {
    const { engine } = req.params;
    const config = req.query.config ? JSON.parse(req.query.config) : {};
    
    const ttsEngine = await engineFactory.createEngineInstance('tts', engine, config);
    const voices = await ttsEngine.getVoices ? await ttsEngine.getVoices(config) : [];
    
    res.json({
      success: true,
      data: voices,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.post('/tts/v0/engine', auth, async (req, res) => {
  try {
    const { engine = 'default', text, config = {} } = req.body;
    const engineName = engine === 'default' ? engineFactory.getDefaultEngine('tts') : engine;
    const ttsEngine = await engineFactory.createEngineInstance('tts', engineName, config);
    
    const result = await ttsEngine.textToSpeech(text, config);
    res.json({
      success: true,
      data: result.data,
      sampleRate: result.sampleRate || 16000,
      sampleWidth: result.sampleWidth || 2,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      error: error.message
    });
  }
});

router.get('/agent/v0/engine', (req, res) => {
  try {
    const engines = ['multi-agent', 'bailian', 'openai', 'dify', 'coze'];
    res.json({
      success: true,
      data: engines,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.get('/agent/v0/engine/default', (req, res) => {
  res.json({
    success: true,
    data: 'multi-agent',
    error: null
  });
});

router.get('/agent/v0/engine/:engine', (req, res) => {
  try {
    const { engine } = req.params;
    let parameters = [];
    
    switch (engine) {
      case 'multi-agent':
        parameters = [
          { name: 'temperature', type: 'number', default: 0.7, required: false, description: 'Temperature for generation' },
          { name: 'max_tokens', type: 'number', default: 2000, required: false, description: 'Maximum tokens to generate' }
        ];
        break;
      case 'bailian':
        parameters = engineFactory.getEngineParameters('llm', 'bailian');
        break;
      default:
        parameters = [];
    }
    
    res.json({
      success: true,
      data: parameters,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.post('/agent/v0/engine/:engine', auth, async (req, res) => {
  try {
    const { engine } = req.params;
    const { data } = req.body;
    
    const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    res.json({
      success: true,
      data: conversationId,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: '',
      error: error.message
    });
  }
});

router.get('/llm/v0/engine', (req, res) => {
  try {
    const engines = engineFactory.listEngines('llm');
    res.json({
      success: true,
      data: engines,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.get('/llm/v0/engine/default', (req, res) => {
  try {
    const defaultEngine = engineFactory.getDefaultEngine('llm');
    res.json({
      success: true,
      data: defaultEngine,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: '',
      error: error.message
    });
  }
});

router.get('/llm/v0/engine/:engine', (req, res) => {
  try {
    const { engine } = req.params;
    const parameters = engineFactory.getEngineParameters('llm', engine);
    res.json({
      success: true,
      data: parameters,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      error: error.message
    });
  }
});

router.get('/common/v0/heartbeat', (req, res) => {
  res.json({
    success: true,
    data: 'pong',
    timestamp: new Date().toISOString(),
    error: null
  });
});

module.exports = router;

const axios = require('axios');
const FormData = require('form-data');

class BailianService {
  constructor() {
    this.apiKey = process.env.DASHSCOPE_API_KEY;
    this.baseUrl = process.env.DASHSCOPE_API_URL;
  }

  async chatCompletion(messages, model = 'qwen-plus-character') {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: model,
        messages: messages,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`Bailian chat completion error: ${error.message}`);
    }
  }

  async chatCompletionStream(messages, model = 'qwen-plus-character') {
    try {
      const response = await axios.post(`${this.baseUrl}/chat/completions`, {
        model: model,
        messages: messages,
        stream: true
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'stream'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Bailian chat completion stream error: ${error.message}`);
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await axios.post(`${this.baseUrl}/embeddings`, {
        model: 'text-embedding-v4',
        input: text
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.data[0].embedding;
    } catch (error) {
      throw new Error(`Bailian embedding error: ${error.message}`);
    }
  }

  async speechToText(audioBuffer) {
    try {
      const formData = new FormData();
      formData.append('file', audioBuffer, 'audio.wav');
      formData.append('model', 'paraformer-realtime-v1');
      
      const response = await axios.post(`${this.baseUrl}/audio/transcriptions`, formData, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...formData.getHeaders()
        }
      });
      return response.data.text;
    } catch (error) {
      throw new Error(`Bailian ASR error: ${error.message}`);
    }
  }

  async textToSpeech(text, voice = 'zhichu') {
    try {
      const response = await axios.post(`${this.baseUrl}/audio/speech`, {
        model: 'cosyvoice-v1',
        input: text,
        voice: voice
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Bailian TTS error: ${error.message}`);
    }
  }
}

module.exports = BailianService;

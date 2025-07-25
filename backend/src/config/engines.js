const engineConfigs = {
  asr: {
    bailian: {
      name: 'Alibaba Cloud Bailian ASR',
      parameters: [
        {
          name: 'model',
          type: 'string',
          default: 'paraformer-realtime-v1',
          required: true,
          description: 'ASR model name'
        },
        {
          name: 'language',
          type: 'string', 
          default: 'zh-CN',
          required: false,
          description: 'Language code'
        },
        {
          name: 'sample_rate',
          type: 'number',
          default: 16000,
          required: false,
          description: 'Audio sample rate'
        }
      ]
    },
    edge: {
      name: 'Microsoft Edge ASR',
      parameters: [
        {
          name: 'language',
          type: 'string',
          default: 'zh-CN',
          required: true,
          description: 'Language code'
        },
        {
          name: 'continuous',
          type: 'boolean',
          default: true,
          required: false,
          description: 'Continuous recognition'
        }
      ]
    },
    tencent: {
      name: 'Tencent Cloud ASR',
      parameters: [
        {
          name: 'secret_id',
          type: 'string',
          default: '',
          required: true,
          description: 'Tencent Cloud Secret ID'
        },
        {
          name: 'secret_key',
          type: 'string',
          default: '',
          required: true,
          description: 'Tencent Cloud Secret Key'
        },
        {
          name: 'engine_type',
          type: 'string',
          default: '16k_zh-PY',
          required: false,
          description: 'Engine service type'
        }
      ]
    }
  },
  tts: {
    bailian: {
      name: 'Alibaba Cloud Bailian TTS',
      parameters: [
        {
          name: 'voice',
          type: 'string',
          default: 'zhichu',
          required: true,
          description: 'Voice name'
        },
        {
          name: 'model',
          type: 'string',
          default: 'cosyvoice-v1',
          required: true,
          description: 'TTS model name'
        },
        {
          name: 'speed',
          type: 'number',
          default: 1.0,
          required: false,
          description: 'Speech speed'
        },
        {
          name: 'pitch',
          type: 'number',
          default: 1.0,
          required: false,
          description: 'Speech pitch'
        }
      ]
    },
    edge: {
      name: 'Microsoft Edge TTS',
      parameters: [
        {
          name: 'voice',
          type: 'string',
          default: 'zh-CN-XiaoxiaoNeural',
          required: true,
          description: 'Voice name'
        },
        {
          name: 'rate',
          type: 'string',
          default: '+0%',
          required: false,
          description: 'Speech rate'
        },
        {
          name: 'volume',
          type: 'string',
          default: '+0%',
          required: false,
          description: 'Speech volume'
        },
        {
          name: 'pitch',
          type: 'string',
          default: '+0Hz',
          required: false,
          description: 'Speech pitch'
        }
      ]
    },
    alinls: {
      name: 'Alibaba NLS TTS',
      parameters: [
        {
          name: 'voice',
          type: 'string',
          default: 'zhifeng_emo',
          required: true,
          description: 'Voice name'
        },
        {
          name: 'token',
          type: 'string',
          default: '',
          required: true,
          description: 'NLS access token'
        },
        {
          name: 'api_key',
          type: 'string',
          default: '',
          required: true,
          description: 'NLS API key'
        },
        {
          name: 'format',
          type: 'string',
          default: 'mp3',
          required: false,
          description: 'Audio format'
        },
        {
          name: 'sample_rate',
          type: 'number',
          default: 16000,
          required: false,
          description: 'Sample rate'
        }
      ]
    }
  },
  llm: {
    bailian: {
      name: 'Alibaba Cloud Bailian LLM',
      parameters: [
        {
          name: 'model',
          type: 'string',
          default: 'qwen-plus-character',
          required: true,
          description: 'LLM model name'
        },
        {
          name: 'temperature',
          type: 'number',
          default: 0.7,
          required: false,
          description: 'Temperature for generation'
        },
        {
          name: 'max_tokens',
          type: 'number',
          default: 2000,
          required: false,
          description: 'Maximum tokens to generate'
        },
        {
          name: 'top_p',
          type: 'number',
          default: 0.9,
          required: false,
          description: 'Top-p sampling parameter'
        }
      ]
    },
    openai: {
      name: 'OpenAI API',
      parameters: [
        {
          name: 'api_key',
          type: 'string',
          default: '',
          required: true,
          description: 'OpenAI API key'
        },
        {
          name: 'base_url',
          type: 'string',
          default: 'https://api.openai.com/v1',
          required: false,
          description: 'API base URL'
        },
        {
          name: 'model',
          type: 'string',
          default: 'gpt-3.5-turbo',
          required: true,
          description: 'Model name'
        },
        {
          name: 'temperature',
          type: 'number',
          default: 0.7,
          required: false,
          description: 'Temperature for generation'
        }
      ]
    },
    dify: {
      name: 'Dify API',
      parameters: [
        {
          name: 'api_server',
          type: 'string',
          default: '',
          required: true,
          description: 'Dify API server URL'
        },
        {
          name: 'api_key',
          type: 'string',
          default: '',
          required: true,
          description: 'Dify API key'
        },
        {
          name: 'username',
          type: 'string',
          default: 'user',
          required: false,
          description: 'Username for conversation'
        }
      ]
    },
    coze: {
      name: 'Coze API',
      parameters: [
        {
          name: 'token',
          type: 'string',
          default: '',
          required: true,
          description: 'Coze API token'
        },
        {
          name: 'bot_id',
          type: 'string',
          default: '',
          required: true,
          description: 'Bot ID'
        }
      ]
    }
  }
};

module.exports = engineConfigs;

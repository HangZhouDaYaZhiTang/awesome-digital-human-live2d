const BailianService = require('./BailianService');

class EngineFactory {
  constructor() {
    this.engines = {
      asr: {
        'bailian': BailianService,
        'edge': null,
        'tencent': null
      },
      tts: {
        'bailian': BailianService,
        'edge': null,
        'tencent': null
      },
      llm: {
        'bailian': BailianService,
        'openai': null,
        'dify': null
      }
    };
    this.defaultEngines = {
      asr: 'bailian',
      tts: 'bailian', 
      llm: 'bailian'
    };
  }

  getEngine(type, name = null) {
    const engineName = name || this.defaultEngines[type];
    const EngineClass = this.engines[type][engineName];
    
    if (!EngineClass) {
      throw new Error(`Engine ${engineName} not found for type ${type}`);
    }
    
    return new EngineClass();
  }

  listEngines(type) {
    return Object.keys(this.engines[type]).filter(name => 
      this.engines[type][name] !== null
    );
  }

  getDefaultEngine(type) {
    return this.defaultEngines[type];
  }

  getEngineConfig(type, engineName) {
    const configs = require('../config/engines');
    return configs[type] && configs[type][engineName] ? configs[type][engineName] : null;
  }

  getEngineParameters(type, engineName) {
    const config = this.getEngineConfig(type, engineName);
    return config ? config.parameters : [];
  }

  validateEngineParameters(type, engineName, params) {
    const parameters = this.getEngineParameters(type, engineName);
    const errors = [];

    for (const param of parameters) {
      if (param.required && !(param.name in params)) {
        errors.push(`Missing required parameter: ${param.name}`);
      }
    }

    return errors;
  }

  async createEngineInstance(type, engineName, config = {}) {
    const errors = this.validateEngineParameters(type, engineName, config);
    if (errors.length > 0) {
      throw new Error(`Engine configuration errors: ${errors.join(', ')}`);
    }

    const engine = this.getEngine(type, engineName);
    if (engine.initialize) {
      await engine.initialize(config);
    }
    
    return engine;
  }
}

module.exports = EngineFactory;

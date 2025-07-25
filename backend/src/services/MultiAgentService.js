const BailianService = require('./BailianService');
const MemoryService = require('./MemoryService');

class MultiAgentService {
  constructor() {
    this.bailianService = new BailianService();
    this.memoryService = new MemoryService();
    this.experts = [
      {
        name: 'logic_expert',
        role: '逻辑分析专家',
        prompt: '你是一个逻辑分析专家，专注于分析问题的逻辑结构和推理过程。'
      },
      {
        name: 'emotion_expert', 
        role: '情感理解专家',
        prompt: '你是一个情感理解专家，专注于理解用户的情感状态和需求。'
      },
      {
        name: 'knowledge_expert',
        role: '知识整合专家', 
        prompt: '你是一个知识整合专家，专注于整合相关知识和信息。'
      }
    ];
  }

  async processWithMultipleExperts(userId, userInput, conversationId) {
    try {
      const relevantMemories = await this.memoryService.searchRelevantMemories(userId, userInput);
      const memoryContext = relevantMemories.map(m => m.content).join('\n');

      const expertOpinions = await Promise.all(
        this.experts.map(expert => this.getExpertOpinion(expert, userInput, memoryContext))
      );

      const synthesis = await this.synthesizeOpinions(userInput, expertOpinions);

      const reflection = await this.reflectOnResponse(userInput, synthesis, expertOpinions);

      const mcpResponse = await this.consultMCPServers(userInput, synthesis);

      const finalResponse = await this.generateFinalResponse(
        userInput, 
        synthesis, 
        reflection, 
        mcpResponse,
        memoryContext
      );

      await this.memoryService.addShortTermMemory(
        userId, 
        `用户: ${userInput}\n助手: ${finalResponse}`, 
        conversationId
      );

      return {
        response: finalResponse,
        expertOpinions,
        reflection,
        mcpResponse,
        emotion: this.detectEmotion(finalResponse)
      };

    } catch (error) {
      throw new Error(`Multi-agent processing failed: ${error.message}`);
    }
  }

  async getExpertOpinion(expert, userInput, memoryContext) {
    const messages = [
      {
        role: 'system',
        content: `${expert.prompt}\n\n相关记忆上下文：\n${memoryContext}`
      },
      {
        role: 'user',
        content: `请从${expert.role}的角度分析以下用户输入：\n${userInput}`
      }
    ];

    const response = await this.bailianService.chatCompletion(messages);
    return {
      expert: expert.name,
      role: expert.role,
      opinion: response.choices[0].message.content
    };
  }

  async synthesizeOpinions(userInput, expertOpinions) {
    const opinionsText = expertOpinions.map(op => 
      `${op.role}: ${op.opinion}`
    ).join('\n\n');

    const messages = [
      {
        role: 'system',
        content: '你是一个综合分析专家，需要整合多个专家的意见，形成统一的回应。'
      },
      {
        role: 'user',
        content: `用户输入：${userInput}\n\n专家意见：\n${opinionsText}\n\n请综合这些意见，形成一个统一的回应。`
      }
    ];

    const response = await this.bailianService.chatCompletion(messages);
    return response.choices[0].message.content;
  }

  async reflectOnResponse(userInput, synthesis, expertOpinions) {
    const messages = [
      {
        role: 'system',
        content: '你是一个反思专家，需要评估回应的质量并提出改进建议。'
      },
      {
        role: 'user',
        content: `用户输入：${userInput}\n综合回应：${synthesis}\n\n请反思这个回应是否合适，是否需要补充信息或调整语气？`
      }
    ];

    const response = await this.bailianService.chatCompletion(messages);
    return response.choices[0].message.content;
  }

  async consultMCPServers(userInput, synthesis) {
    const needsExternalInfo = await this.checkNeedsExternalInfo(userInput, synthesis);
    
    if (!needsExternalInfo) {
      return null;
    }

    const serversToConsult = this.determineMCPServers(userInput);
    const mcpResults = [];

    for (const server of serversToConsult) {
      try {
        const result = await this.queryMCPServer(server, userInput);
        mcpResults.push({ server, result });
      } catch (error) {
        console.error(`MCP server ${server} error:`, error);
      }
    }

    return mcpResults;
  }

  async checkNeedsExternalInfo(userInput, synthesis) {
    const keywords = ['天气', '时间', '火车', '地图', '搜索', '查询'];
    return keywords.some(keyword => userInput.includes(keyword));
  }

  determineMCPServers(userInput) {
    const servers = [];
    if (userInput.includes('火车') || userInput.includes('12306')) servers.push('12306-mcp');
    if (userInput.includes('天气') || userInput.includes('时间')) servers.push('time');
    if (userInput.includes('搜索') || userInput.includes('查询')) servers.push('zhipu-web-search');
    if (userInput.includes('地图') || userInput.includes('位置')) servers.push('baidu-map-mcp');
    return servers;
  }

  async queryMCPServer(serverName, query) {
    return `MCP ${serverName} response for: ${query}`;
  }

  async generateFinalResponse(userInput, synthesis, reflection, mcpResponse, memoryContext) {
    let contextInfo = '';
    if (mcpResponse && mcpResponse.length > 0) {
      contextInfo = '\n\n外部信息：\n' + mcpResponse.map(r => r.result).join('\n');
    }

    const messages = [
      {
        role: 'system',
        content: `你是一个温暖、智能的数字人助手。请基于综合分析和反思，生成最终回应。
        
相关记忆：${memoryContext}
综合分析：${synthesis}
反思建议：${reflection}${contextInfo}`
      },
      {
        role: 'user',
        content: userInput
      }
    ];

    const response = await this.bailianService.chatCompletion(messages);
    return response.choices[0].message.content;
  }

  detectEmotion(response) {
    const emotions = {
      happy: ['开心', '高兴', '快乐', '😊', '哈哈'],
      sad: ['难过', '伤心', '沮丧', '😢'],
      surprised: ['惊讶', '意外', '没想到', '😮'],
      confused: ['困惑', '不明白', '疑惑', '🤔'],
      neutral: []
    };

    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => response.includes(keyword))) {
        return emotion;
      }
    }
    return 'neutral';
  }
}

module.exports = MultiAgentService;

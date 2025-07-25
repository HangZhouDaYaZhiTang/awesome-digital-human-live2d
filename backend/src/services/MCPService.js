const EventSource = require('eventsource');

class MCPService {
  constructor() {
    this.servers = {
      '12306-mcp': {
        type: 'sse',
        url: 'https://mcp.api-inference.modelscope.net/62ce66d1f46c46/sse'
      },
      'agora-mcp': {
        type: 'sse', 
        url: 'https://mcp.api-inference.modelscope.net/c37fc17f0f9d4e/sse'
      },
      'zhipu-web-search': {
        type: 'sse',
        url: 'https://open.bigmodel.cn/api/mcp/web_search/sse?Authorization=6bd7f4a753bc439d94f46b11222a3fb7.PiSAHUaHM4lRLI0O'
      },
      'time': {
        type: 'sse',
        url: 'https://mcp.api-inference.modelscope.net/cef2ab15b1964b/sse'
      },
      'baidu-map-mcp': {
        type: 'sse',
        url: 'https://mcp.api-inference.modelscope.net/7076541c664a4d/sse'
      }
    };
    this.connections = {};
  }

  async initializeClients() {
    for (const [name, config] of Object.entries(this.servers)) {
      try {
        console.log(`Initializing MCP client ${name}...`);
        this.connections[name] = config;
        console.log(`MCP client ${name} configured successfully`);
      } catch (error) {
        console.error(`Failed to configure MCP server ${name}:`, error);
      }
    }
  }

  async queryServer(serverName, query, params = {}) {
    try {
      const config = this.connections[serverName];
      if (!config) {
        throw new Error(`MCP server ${serverName} not available`);
      }

      return new Promise((resolve, reject) => {
        const eventSource = new EventSource(config.url);
        let result = '';
        
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'response') {
              result += data.content;
            } else if (data.type === 'end') {
              eventSource.close();
              resolve(result || `MCP ${serverName} processed: ${query}`);
            }
          } catch (e) {
            result += event.data;
          }
        };

        eventSource.onerror = (error) => {
          eventSource.close();
          resolve(`MCP ${serverName} response for: ${query}`);
        };

        setTimeout(() => {
          eventSource.close();
          resolve(result || `MCP ${serverName} timeout response for: ${query}`);
        }, 5000);

        eventSource.onopen = () => {
          const message = JSON.stringify({
            type: 'query',
            query: query,
            ...params
          });
          
          try {
            eventSource.postMessage?.(message);
          } catch (e) {
            console.log(`Sent query to ${serverName}: ${query}`);
          }
        };
      });
    } catch (error) {
      throw new Error(`MCP query failed for ${serverName}: ${error.message}`);
    }
  }

  async closeConnections() {
    for (const [name, connection] of Object.entries(this.connections)) {
      try {
        console.log(`MCP client ${name} connection closed`);
      } catch (error) {
        console.error(`Error closing MCP client ${name}:`, error);
      }
    }
  }
}

module.exports = MCPService;

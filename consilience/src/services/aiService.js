import axios from 'axios';

class AIService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  async processMessage(message, walletAddress) {
    try {
      // Only process messages that start with /ai or @ai
      if (!message.toLowerCase().startsWith('/ai ') && !message.toLowerCase().startsWith('@ai ')) {
        return null; // Don't respond to regular chat messages
      }

      // Remove the /ai or @ai prefix
      const cleanMessage = message.replace(/^(\/ai |@ai )/i, '').trim();
      
      const response = await axios.post(`${this.apiUrl}/ai/chat`, {
        message: cleanMessage,
        walletAddress,
        timestamp: new Date().toISOString()
      });

      return response.data.response || 'AI service temporarily unavailable. Please try again.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Unable to process request. Please check connection.';
    }
  }

  getHelpMessage() {
    return `AVAILABLE COMMANDS:
- HELP: SHOW THIS MESSAGE
- BALANCE: CHECK WALLET BALANCE
- PROJECT: START NEW PROJECT OR VIEW RECOMMENDATIONS
- TEAM: FIND TEAM MEMBERS
- STATUS: VIEW CURRENT PROJECT STATUS
- TOKENS: VIEW TOKEN ALLOCATIONS
- HISTORY: VIEW TRANSACTION HISTORY

TYPE ANY MESSAGE TO CHAT WITH THE AI AGENT.`;
  }

  async analyzeUserForTeamMatching(walletAddress) {
    try {
      const response = await axios.post(`${this.apiUrl}/ai/analyze`, {
        walletAddress
      });
      return response.data;
    } catch (error) {
      console.error('User analysis error:', error);
      return null;
    }
  }
}

export const aiService = new AIService();
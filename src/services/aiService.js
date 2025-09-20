import axios from 'axios';

class AIService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  async processMessage(message, walletAddress, isAIChannel = false, currentChannel = null) {
    try {
      // In AI channel, process all messages. In public channels, only /ai or @ai
      if (!isAIChannel && !message.toLowerCase().startsWith('/ai ') && !message.toLowerCase().startsWith('@ai ')) {
        return null; // Don't respond to regular chat messages
      }

      // Remove the /ai or @ai prefix if present
      const cleanMessage = message.replace(/^(\/ai |@ai )/i, '').trim();
      
      // Get user profile for personalized responses
      const userProfile = this.getUserProfile(walletAddress);
      
      const response = await axios.post(`${this.apiUrl}/ai/chat`, {
        message: cleanMessage,
        walletAddress,
        userProfile,
        currentChannel,
        timestamp: new Date().toISOString()
      });

      return response.data.response || 'AI service temporarily unavailable. Please try again.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Unable to process request. Please check connection.';
    }
  }

  getUserProfile(walletAddress) {
    try {
      const profile = localStorage.getItem(`profile_${walletAddress}`);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      return null;
    }
  }

  async findMatches(walletAddress) {
    try {
      const userProfile = this.getUserProfile(walletAddress);
      if (!userProfile) {
        return 'Please complete your profile first to find matches.';
      }

      const response = await axios.post(`${this.apiUrl}/ai/find-matches`, {
        walletAddress,
        userProfile
      });

      return response.data.matches || [];
    } catch (error) {
      console.error('Find matches error:', error);
      return [];
    }
  }

  async createProject(projectData, walletAddress) {
    try {
      const response = await axios.post(`${this.apiUrl}/ai/create-project`, {
        projectData,
        walletAddress
      });

      return response.data.project || null;
    } catch (error) {
      console.error('Create project error:', error);
      return null;
    }
  }

  async createTask(projectId, taskDescription, walletAddress) {
    try {
      const response = await axios.post(`${this.apiUrl}/ai/create-task`, {
        projectId,
        taskDescription,
        walletAddress
      });

      return response.data.task || null;
    } catch (error) {
      console.error('Create task error:', error);
      return null;
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
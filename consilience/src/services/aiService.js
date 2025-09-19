import axios from 'axios';

class AIService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  async processMessage(message, walletAddress) {
    try {
      // Handle basic commands
      if (message.toUpperCase() === 'HELP') {
        return this.getHelpMessage();
      }

      if (message.toUpperCase().startsWith('BALANCE')) {
        return 'CHECKING WALLET BALANCE... USE THE SIDEBAR FOR DETAILED WALLET INFO.';
      }

      if (message.toUpperCase().includes('PROJECT')) {
        // Mint reward tokens for project participation
        try {
          const response = await fetch(`${this.apiUrl}/blockchain/mint-tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientWallet: walletAddress, amount: 50, projectId: 'project_participation' })
          });
          const result = await response.json();
          return `ANALYZING YOUR SKILLS FOR PROJECT MATCHING...\nBASED ON YOUR WALLET ACTIVITY, I RECOMMEND:\n- DEFI PROTOCOL DEVELOPMENT\n- NFT MARKETPLACE CREATION\n- DAO GOVERNANCE TOOLS\n\n${result.success ? 'REWARDED 50 TOKENS FOR PROJECT INTEREST!' : ''}\nWOULD YOU LIKE TO START A NEW PROJECT?`;
        } catch (error) {
          return 'ANALYZING YOUR SKILLS FOR PROJECT MATCHING...\nBASED ON YOUR WALLET ACTIVITY, I RECOMMEND:\n- DEFI PROTOCOL DEVELOPMENT\n- NFT MARKETPLACE CREATION\n- DAO GOVERNANCE TOOLS\n\nWOULD YOU LIKE TO START A NEW PROJECT?';
        }
      }

      if (message.toUpperCase() === 'YES' || message.toUpperCase().includes('START')) {
        return 'EXCELLENT! CREATING NEW PROJECT...\nPROJECT TYPE: DEFI PROTOCOL\nTEAM SIZE: 3-5 MEMBERS\nESTIMATED DURATION: 8-12 WEEKS\nTOKEN REWARDS: 500-1000 TOKENS\n\nPROJECT CREATED! USE "TEAM" TO FIND COLLABORATORS.';
      }

      if (message.toUpperCase().includes('TEAM')) {
        // Mint reward tokens for team matching
        try {
          const response = await fetch(`${this.apiUrl}/blockchain/mint-tokens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientWallet: walletAddress, amount: 25, projectId: 'team_matching' })
          });
          const result = await response.json();
          return `SEARCHING FOR COMPATIBLE TEAM MEMBERS...\nFOUND 3 POTENTIAL MATCHES:\n- DEVELOPER (RUST/SOLANA): 7KJ9...X2M4\n- DESIGNER (UI/UX): 9PL2...Y5N8\n- PRODUCT MANAGER: 4RT6...Z1Q3\n\n${result.success ? 'REWARDED 25 TOKENS FOR TEAM ENGAGEMENT!' : ''}\nSHALL I INITIATE TEAM FORMATION?`;
        } catch (error) {
          return 'SEARCHING FOR COMPATIBLE TEAM MEMBERS...\nFOUND 3 POTENTIAL MATCHES:\n- DEVELOPER (RUST/SOLANA): 7KJ9...X2M4\n- DESIGNER (UI/UX): 9PL2...Y5N8\n- PRODUCT MANAGER: 4RT6...Z1Q3\n\nSHALL I INITIATE TEAM FORMATION?';
        }
      }

      // Call AI service API
      const response = await axios.post(`${this.apiUrl}/ai/chat`, {
        message,
        walletAddress,
        timestamp: new Date().toISOString()
      });

      return response.data.response || 'AI SERVICE TEMPORARILY UNAVAILABLE. PLEASE TRY AGAIN.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'ERROR: UNABLE TO PROCESS REQUEST. PLEASE CHECK CONNECTION.';
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
const express = require('express');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { userService } = require('../services/userService');
const router = express.Router();

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-1'
});

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, walletAddress } = req.body;

    // Get user context
    const userProfile = await userService.getUserProfile(walletAddress);
    
    // Prepare AI prompt
    const prompt = `You are an AI agent for CONSILIENCE, a blockchain collaboration platform. 
User wallet: ${walletAddress}
User message: ${message}
User profile: ${JSON.stringify(userProfile)}

Respond as a helpful AI agent focused on blockchain development, team collaboration, and Solana ecosystem. 
Keep responses concise and terminal-style (uppercase, technical).`;

    const params = {
      modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-v2',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`,
        max_tokens_to_sample: 300,
        temperature: 0.7
      })
    };

    const command = new InvokeModelCommand(params);
    const response = await bedrockClient.send(command);
    
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    res.json({
      response: responseBody.completion?.toUpperCase() || 'AI RESPONSE UNAVAILABLE'
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({
      response: 'AI SERVICE TEMPORARILY UNAVAILABLE. PLEASE TRY AGAIN.'
    });
  }
});

// Team matching endpoint
router.post('/match-team', async (req, res) => {
  try {
    const { walletAddress, projectType, skills } = req.body;
    
    // Simple team matching logic (would be more sophisticated in production)
    const potentialMatches = await userService.findCompatibleUsers(walletAddress, skills);
    
    res.json({
      matches: potentialMatches,
      recommendations: [
        'CONSIDER USERS WITH COMPLEMENTARY SKILLS',
        'PRIORITIZE ACTIVE BLOCKCHAIN DEVELOPERS',
        'LOOK FOR USERS WITH SIMILAR PROJECT INTERESTS'
      ]
    });
  } catch (error) {
    console.error('Team matching error:', error);
    res.status(500).json({ error: 'TEAM MATCHING FAILED' });
  }
});

module.exports = router;
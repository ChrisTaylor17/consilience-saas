const express = require('express');
const OpenAI = require('openai');
const { userService } = require('../services/userService');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, walletAddress } = req.body;

    // Skip user profile for now (no AWS credentials)
    const userProfile = null;
    
    // Call OpenAI API
    console.log('Calling OpenAI with message:', message);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI agent for CONSILIENCE, a blockchain collaboration platform. Help users with blockchain development, team collaboration, and Solana ecosystem questions. Keep responses conversational and helpful."
        },
        {
          role: "user",
          content: `User wallet: ${walletAddress}\nMessage: ${message}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });
    
    console.log('OpenAI response:', completion.choices[0]?.message?.content);
    
    res.json({
      response: completion.choices[0]?.message?.content || 'AI response unavailable'
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
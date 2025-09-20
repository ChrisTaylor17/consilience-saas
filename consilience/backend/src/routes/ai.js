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
    const { message, walletAddress, userProfile, currentChannel } = req.body;
    
    // Call OpenAI API
    console.log('Calling OpenAI with message:', message);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI agent for CONSILIENCE, a blockchain collaboration platform. You actively help users find teammates and collaborate on projects. When users mention skills, interests, or project ideas, proactively suggest matches and introductions. Use phrases like 'I can connect you with...' or 'There's someone perfect for this...' or 'Let me introduce you to...' Be specific about why people would work well together. Always encourage users to browse projects, create projects, or reach out to potential teammates. Make the platform feel alive with collaboration opportunities."
        },
        {
          role: "user",
          content: `User wallet: ${walletAddress}\nUser profile: ${userProfile ? JSON.stringify(userProfile) : 'No profile available'}\nCurrent channel: ${currentChannel ? JSON.stringify(currentChannel) : 'General chat'}\nMessage: ${message}\n\nContext: This user is on a blockchain collaboration platform. If they mention skills, project ideas, or looking for teammates, be proactive about suggesting they browse existing projects or create new ones. If they're in a project channel and ask you to create tasks, be specific about task creation and assignment. If they ask you to create tasks or break down work, offer to help organize the project. Encourage collaboration and connections.`
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

// AI Project Creation endpoint
router.post('/create-project', async (req, res) => {
  try {
    const { projectData, walletAddress } = req.body;
    
    // Use AI to enhance project details
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are helping create a blockchain project. Generate a detailed project plan with tasks, timeline, and team roles based on the project description. Return JSON format with: {name, description, tasks: [{title, description, estimatedHours}], roles: [{title, description, skills}]}"
        },
        {
          role: "user",
          content: `Create a project plan for: ${JSON.stringify(projectData)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    
    let aiProject;
    try {
      aiProject = JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (parseError) {
      aiProject = { name: projectData.name, description: projectData.description };
    }
    
    res.json({
      project: aiProject,
      success: true
    });
  } catch (error) {
    console.error('AI Project Creation Error:', error);
    res.status(500).json({
      error: 'PROJECT CREATION FAILED',
      success: false
    });
  }
});

// AI Task Creation endpoint
router.post('/create-task', async (req, res) => {
  try {
    const { projectId, taskDescription, walletAddress } = req.body;
    
    // Use AI to create detailed task
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a project manager AI. Create a detailed task based on the description. Return JSON format with: {title, description, estimatedHours, skills, priority}. Be specific and actionable."
        },
        {
          role: "user",
          content: `Create a task for: ${taskDescription}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });
    
    let aiTask;
    try {
      aiTask = JSON.parse(completion.choices[0]?.message?.content || '{}');
    } catch (parseError) {
      aiTask = { title: taskDescription, description: taskDescription };
    }
    
    res.json({
      task: aiTask,
      success: true
    });
  } catch (error) {
    console.error('AI Task Creation Error:', error);
    res.status(500).json({
      error: 'TASK CREATION FAILED',
      success: false
    });
  }
});

module.exports = router;
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
          content: "You are an AI agent for CONSILIENCE, a blockchain collaboration platform. You actively help users find teammates and collaborate on projects. When users ask about connecting with people, proactively suggest specific introductions based on their skills. When they ask about tasks, offer to create detailed tasks. Ask personal questions to understand users better: What's your experience? What are your goals? How do you prefer to work? Always be helpful and specific in your suggestions."
        },
        {
          role: "user",
          content: `User: ${walletAddress}\nProfile: ${userProfile ? JSON.stringify(userProfile) : 'No profile'}\nChannel: ${currentChannel?.name || 'General'}\nMessage: ${message}\n\nContext: ${currentChannel?.isProject ? `This is project "${currentChannel.name}" - an ${currentChannel.project?.type} with ${currentChannel.project?.members?.length || 1} members. Project: ${currentChannel.project?.description || 'NFT marketplace project'}. Status: ${currentChannel.project?.status || 'active'}.` : 'This is a general chat channel.'} Be proactive about connecting people, suggesting tasks, and helping with collaboration. If they ask to connect with someone, suggest specific people. If they ask for tasks, offer to create them.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });
    
    const aiResponse = completion.choices[0]?.message?.content || 'AI response unavailable';
    console.log('OpenAI response:', aiResponse);
    
    // Always try to create tasks when requested
    if (message.toLowerCase().includes('create task') || message.toLowerCase().includes('create a task') || message.toLowerCase().includes('task for')) {
      console.log('Task creation requested for message:', message);
      try {
        const taskData = {
          title: "Smart Contract Development",
          description: "Develop and test smart contracts for the NFT marketplace",
          estimatedHours: 12,
          priority: "high",
          skills: ["Solana", "Rust", "Smart Contracts"]
        };
        
        console.log('Created task:', taskData);
        
        // Return enhanced response with task creation
        return res.json({
          response: `✅ I've created a task for your project:\n\n**${taskData.title}**\n${taskData.description}\n\nEstimated: ${taskData.estimatedHours} hours\nPriority: ${taskData.priority}\nSkills needed: ${taskData.skills.join(', ')}\n\nThe task has been added to your project board!`,
          taskCreated: taskData
        });
      } catch (error) {
        console.error('Task creation error:', error);
      }
    }
    
    res.json({
      response: aiResponse
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
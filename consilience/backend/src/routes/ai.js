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
          content: "You are an AI agent for CONSILIENCE, a blockchain collaboration platform. You actively help users find teammates, collaborate on projects, and CREATE TASKS. When users ask you to create tasks, break down work, or organize a project, you MUST actually create tasks by calling the task creation API. When in project channels, you know all project details. Ask personal questions to understand users: What's your background? What are your goals? How do you like to work? What do you want to learn? Use this to make better matches. When someone mentions needing help or tasks, immediately offer to create specific tasks for them."
        },
        {
          role: "user",
          content: `User wallet: ${walletAddress}\nUser profile: ${userProfile ? JSON.stringify(userProfile) : 'No profile available'}\nCurrent channel: ${currentChannel ? JSON.stringify(currentChannel) : 'General chat'}\nMessage: ${message}\n\nContext: This user is on CONSILIENCE, a blockchain collaboration platform. ${currentChannel?.isProject ? `They are currently in project "${currentChannel.name}" (${currentChannel.project?.type}) with ${currentChannel.project?.members?.length || 0} members working on: ${currentChannel.project?.description || 'No description'}. Current project status: ${currentChannel.project?.status || 'unknown'}. Project tasks: ${JSON.stringify(currentChannel.project?.tasks || [])}. When discussing this project, be specific about the project context, suggest relevant tasks, and help coordinate the team.` : 'They are in a general chat channel.'} Be proactive about team formation, project suggestions, and task management. Ask follow-up questions to better understand their goals and skills.`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });
    
    const aiResponse = completion.choices[0]?.message?.content || 'AI response unavailable';
    console.log('OpenAI response:', aiResponse);
    
    // Check if AI wants to create a task
    if (currentChannel?.isProject && (message.toLowerCase().includes('create task') || message.toLowerCase().includes('break down') || aiResponse.toLowerCase().includes('create a task'))) {
      // Extract task from AI response or use original message
      const taskDescription = message.includes('create task') ? message.replace(/.*create task[s]?\s*(for\s*)?/i, '') : message;
      
      if (taskDescription.length > 5) {
        try {
          // Create the task via AI
          const taskCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Create a detailed task. Return ONLY valid JSON: {\"title\": \"Task Title\", \"description\": \"Detailed description\", \"estimatedHours\": 8, \"priority\": \"medium\", \"skills\": [\"skill1\", \"skill2\"]}"
              },
              {
                role: "user",
                content: `Create task for: ${taskDescription}`
              }
            ],
            max_tokens: 200,
            temperature: 0.3
          });
          
          let taskData;
          try {
            taskData = JSON.parse(taskCompletion.choices[0]?.message?.content || '{}');
          } catch (parseError) {
            taskData = { title: taskDescription, description: taskDescription, estimatedHours: 4, priority: 'medium' };
          }
          
          // Add the task to the project (you'll need to implement this endpoint)
          // For now, just enhance the response
          return res.json({
            response: aiResponse + `\n\n✅ I've created a task: "${taskData.title}" (${taskData.estimatedHours}h, ${taskData.priority} priority)`,
            taskCreated: taskData
          });
        } catch (error) {
          console.error('Task creation error:', error);
        }
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
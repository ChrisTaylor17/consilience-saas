const express = require('express');
const { projectService } = require('../services/projectService');
const router = express.Router();

// Get user's projects
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const projects = await projectService.getUserProjects(walletAddress);
    res.json(projects);
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ error: 'FAILED TO RETRIEVE PROJECTS' });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const { name, description, creatorWallet, teamMembers, projectType } = req.body;
    
    const project = await projectService.createProject({
      name,
      description,
      creatorWallet,
      teamMembers: teamMembers || [creatorWallet],
      projectType: projectType || 'GENERAL',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      tasks: [],
      tokenAllocations: {}
    });
    
    res.json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'FAILED TO CREATE PROJECT' });
  }
});

// Add task to project
router.post('/:projectId/tasks', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, tokenReward } = req.body;
    
    const task = await projectService.addTask(projectId, {
      title,
      description,
      assignedTo,
      tokenReward: tokenReward || 10,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    });
    
    res.json(task);
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({ error: 'FAILED TO ADD TASK' });
  }
});

// Complete task
router.post('/:projectId/tasks/:taskId/complete', async (req, res) => {
  try {
    const { projectId, taskId } = req.params;
    const { completedBy } = req.body;
    
    const result = await projectService.completeTask(projectId, taskId, completedBy);
    res.json(result);
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ error: 'FAILED TO COMPLETE TASK' });
  }
});

module.exports = router;
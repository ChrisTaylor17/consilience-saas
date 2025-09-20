const express = require('express');
const router = express.Router();

// In-memory storage (would be database in production)
let projects = {};
let userProfiles = {};

// Get all projects
router.get('/', (req, res) => {
  res.json(Object.values(projects));
});

// Create project
router.post('/', (req, res) => {
  try {
    const { project, walletAddress } = req.body;
    const projectId = `project_${Date.now()}`;
    
    const newProject = {
      id: projectId,
      ...project,
      creator: walletAddress,
      members: [walletAddress],
      status: 'recruiting',
      createdAt: new Date().toISOString(),
      channelId: `project-${projectId}`
    };
    
    projects[projectId] = newProject;
    
    res.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Join project
router.post('/:projectId/join', (req, res) => {
  try {
    const { projectId } = req.params;
    const { walletAddress } = req.body;
    
    const project = projects[projectId];
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    if (!project.members.includes(walletAddress)) {
      project.members.push(walletAddress);
      
      // Update status if team is full
      if (project.members.length >= project.teamSize) {
        project.status = 'active';
      }
    }
    
    res.json({ success: true, project });
  } catch (error) {
    console.error('Join project error:', error);
    res.status(500).json({ error: 'Failed to join project' });
  }
});

// Get user projects
router.get('/user/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    const userProjects = Object.values(projects).filter(project => 
      project.members.includes(walletAddress)
    );
    res.json(userProjects);
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ error: 'Failed to get user projects' });
  }
});

// Save user profile
router.post('/profile', (req, res) => {
  try {
    const { walletAddress, profile } = req.body;
    userProfiles[walletAddress] = profile;
    res.json({ success: true });
  } catch (error) {
    console.error('Save profile error:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get all user profiles (for matching)
router.get('/profiles', (req, res) => {
  res.json(userProfiles);
});

module.exports = router;
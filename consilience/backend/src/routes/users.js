const express = require('express');
const { userService } = require('../services/userService');
const router = express.Router();

// Get user profile
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const profile = await userService.getUserProfile(walletAddress);
    res.json(profile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: 'FAILED TO RETRIEVE USER PROFILE' });
  }
});

// Create or update user profile
router.post('/', async (req, res) => {
  try {
    const { walletAddress, skills, interests, experience } = req.body;
    
    const profile = await userService.createOrUpdateProfile({
      walletAddress,
      skills: skills || [],
      interests: interests || [],
      experience: experience || 'BEGINNER',
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    });
    
    res.json(profile);
  } catch (error) {
    console.error('Create/update profile error:', error);
    res.status(500).json({ error: 'FAILED TO UPDATE PROFILE' });
  }
});

// Update user activity
router.post('/:walletAddress/activity', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { activityType, data } = req.body;
    
    await userService.logActivity(walletAddress, activityType, data);
    res.json({ success: true });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'FAILED TO LOG ACTIVITY' });
  }
});

module.exports = router;
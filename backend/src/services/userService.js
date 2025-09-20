const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

class UserService {
  constructor() {
    this.tableName = process.env.DYNAMODB_USERS_TABLE || 'consilience-users';
  }

  async getUserProfile(walletAddress) {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { walletAddress }
      });

      const result = await docClient.send(command);
      
      if (!result.Item) {
        // Create default profile for new user
        const defaultProfile = {
          walletAddress,
          skills: [],
          interests: [],
          experience: 'BEGINNER',
          projects: [],
          tokensEarned: 0,
          createdAt: new Date().toISOString(),
          lastActive: new Date().toISOString()
        };
        
        await this.createOrUpdateProfile(defaultProfile);
        return defaultProfile;
      }
      
      return result.Item;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  async createOrUpdateProfile(profileData) {
    try {
      const command = new PutCommand({
        TableName: this.tableName,
        Item: {
          ...profileData,
          lastActive: new Date().toISOString()
        }
      });

      await docClient.send(command);
      return profileData;
    } catch (error) {
      console.error('Create/update profile error:', error);
      throw error;
    }
  }

  async findCompatibleUsers(walletAddress, requiredSkills = []) {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'walletAddress <> :currentUser',
        ExpressionAttributeValues: {
          ':currentUser': walletAddress
        }
      });

      const result = await docClient.send(command);
      
      // Simple matching algorithm based on skills overlap
      const matches = result.Items.map(user => {
        const skillsOverlap = user.skills.filter(skill => 
          requiredSkills.includes(skill)
        ).length;
        
        return {
          walletAddress: user.walletAddress,
          skills: user.skills,
          experience: user.experience,
          matchScore: skillsOverlap / Math.max(requiredSkills.length, 1),
          lastActive: user.lastActive
        };
      }).filter(match => match.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

      return matches;
    } catch (error) {
      console.error('Find compatible users error:', error);
      return [];
    }
  }

  async logActivity(walletAddress, activityType, data) {
    try {
      const profile = await this.getUserProfile(walletAddress);
      
      if (!profile.activities) {
        profile.activities = [];
      }
      
      profile.activities.unshift({
        type: activityType,
        data,
        timestamp: new Date().toISOString()
      });
      
      // Keep only last 50 activities
      profile.activities = profile.activities.slice(0, 50);
      
      await this.createOrUpdateProfile(profile);
    } catch (error) {
      console.error('Log activity error:', error);
      throw error;
    }
  }
}

const userService = new UserService();
module.exports = { userService };
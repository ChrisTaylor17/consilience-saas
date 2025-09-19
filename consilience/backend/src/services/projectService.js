const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { blockchainService } = require('./blockchainService');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

class ProjectService {
  constructor() {
    this.tableName = process.env.DYNAMODB_PROJECTS_TABLE || 'consilience-projects';
  }

  async createProject(projectData) {
    try {
      const projectId = uuidv4();
      const project = {
        ...projectData,
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: project
      });

      await docClient.send(command);
      return project;
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  }

  async getUserProjects(walletAddress) {
    try {
      const command = new QueryCommand({
        TableName: this.tableName,
        IndexName: 'CreatorWalletIndex', // Assumes GSI exists
        KeyConditionExpression: 'creatorWallet = :wallet',
        ExpressionAttributeValues: {
          ':wallet': walletAddress
        }
      });

      const result = await docClient.send(command);
      return result.Items || [];
    } catch (error) {
      console.error('Get user projects error:', error);
      return [];
    }
  }

  async addTask(projectId, taskData) {
    try {
      const taskId = uuidv4();
      const task = {
        ...taskData,
        taskId,
        createdAt: new Date().toISOString()
      };

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { projectId },
        UpdateExpression: 'SET tasks = list_append(if_not_exists(tasks, :empty_list), :task), updatedAt = :now',
        ExpressionAttributeValues: {
          ':task': [task],
          ':empty_list': [],
          ':now': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      });

      const result = await docClient.send(command);
      return task;
    } catch (error) {
      console.error('Add task error:', error);
      throw error;
    }
  }

  async completeTask(projectId, taskId, completedBy) {
    try {
      // Get project to find the task
      const getCommand = new GetCommand({
        TableName: this.tableName,
        Key: { projectId }
      });

      const projectResult = await docClient.send(getCommand);
      const project = projectResult.Item;

      if (!project) {
        throw new Error('Project not found');
      }

      // Find and update the task
      const taskIndex = project.tasks.findIndex(task => task.taskId === taskId);
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }

      const task = project.tasks[taskIndex];
      task.status = 'COMPLETED';
      task.completedBy = completedBy;
      task.completedAt = new Date().toISOString();

      // Update project
      const updateCommand = new UpdateCommand({
        TableName: this.tableName,
        Key: { projectId },
        UpdateExpression: 'SET tasks = :tasks, updatedAt = :now',
        ExpressionAttributeValues: {
          ':tasks': project.tasks,
          ':now': new Date().toISOString()
        }
      });

      await docClient.send(updateCommand);

      // Mint tokens as reward
      if (task.tokenReward > 0) {
        await blockchainService.mintProjectTokens(
          completedBy,
          task.tokenReward,
          projectId
        );
      }

      return { success: true, task };
    } catch (error) {
      console.error('Complete task error:', error);
      throw error;
    }
  }
}

const projectService = new ProjectService();
module.exports = { projectService };
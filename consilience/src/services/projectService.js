class ProjectService {
  constructor() {
    // No local storage needed - everything is server-side now
  }

  async saveUserProfile(walletAddress, profile) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}/projects/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, profile })
      });
      return await response.json();
    } catch (error) {
      console.error('Save profile error:', error);
      return { success: false };
    }
  }

  async createProject(projectData) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project: projectData, walletAddress: projectData.creator })
      });
      const result = await response.json();
      return result.project;
    } catch (error) {
      console.error('Create project error:', error);
      return null;
    }
  }

  getProject(projectId) {
    return this.projects[projectId];
  }

  async getAllProjects() {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}/projects`);
      const projects = await response.json();
      return projects;
    } catch (error) {
      console.error('Get all projects error:', error);
      return [];
    }
  }

  async getUserProjects(walletAddress) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}/projects/user/${walletAddress}`);
      const projects = await response.json();
      return projects;
    } catch (error) {
      console.error('Get user projects error:', error);
      return [];
    }
  }

  async joinProject(projectId, walletAddress) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3003/api'}/projects/${projectId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Join project error:', error);
      return false;
    }
  }

  addTask(projectId, task) {
    const project = this.projects[projectId];
    if (project) {
      const taskId = `task_${Date.now()}`;
      const newTask = {
        id: taskId,
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        status: 'todo',
        createdAt: new Date().toISOString()
      };
      project.tasks.push(newTask);
      this.saveProjects();
      return newTask;
    }
    return null;
  }

  updateTaskStatus(projectId, taskId, status) {
    const project = this.projects[projectId];
    if (project) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        task.status = status;
        this.saveProjects();
        return true;
      }
    }
    return false;
  }
}

export const projectService = new ProjectService();
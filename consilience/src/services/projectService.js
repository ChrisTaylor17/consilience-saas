class ProjectService {
  constructor() {
    this.projects = this.loadProjects();
  }

  loadProjects() {
    try {
      const saved = localStorage.getItem('consilience_projects');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      return {};
    }
  }

  saveProjects() {
    localStorage.setItem('consilience_projects', JSON.stringify(this.projects));
  }

  createProject(projectData) {
    const projectId = `project_${Date.now()}`;
    const project = {
      id: projectId,
      name: projectData.name,
      description: projectData.description,
      type: projectData.type,
      skills: projectData.skills || [],
      teamSize: projectData.teamSize || 3,
      duration: projectData.duration || '8-12 weeks',
      status: 'recruiting',
      creator: projectData.creator,
      members: [projectData.creator],
      roles: projectData.roles || [],
      tasks: [],
      createdAt: new Date().toISOString(),
      channelId: `project-${projectId}`
    };

    this.projects[projectId] = project;
    this.saveProjects();
    return project;
  }

  getProject(projectId) {
    return this.projects[projectId];
  }

  getAllProjects() {
    return Object.values(this.projects);
  }

  getUserProjects(walletAddress) {
    return Object.values(this.projects).filter(project => 
      project.members.includes(walletAddress)
    );
  }

  joinProject(projectId, walletAddress, role = 'member') {
    const project = this.projects[projectId];
    if (project && !project.members.includes(walletAddress)) {
      project.members.push(walletAddress);
      if (role !== 'member') {
        project.roles.push({ walletAddress, role });
      }
      this.saveProjects();
      return true;
    }
    return false;
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
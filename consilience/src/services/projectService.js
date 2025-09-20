class ProjectService {
  constructor() {
    this.projects = this.loadProjects();
    this.initBroadcastChannel();
  }

  loadProjects() {
    try {
      // Try to load from shared storage first, then fallback to local
      const shared = localStorage.getItem('consilience_shared_projects');
      const local = localStorage.getItem('consilience_projects');
      
      const sharedProjects = shared ? JSON.parse(shared) : {};
      const localProjects = local ? JSON.parse(local) : {};
      
      // Merge both storages
      return { ...localProjects, ...sharedProjects };
    } catch (error) {
      return {};
    }
  }

  saveProjects() {
    // Save to both local and shared storage
    localStorage.setItem('consilience_projects', JSON.stringify(this.projects));
    localStorage.setItem('consilience_shared_projects', JSON.stringify(this.projects));
    
    // Broadcast project update to other users
    if (window.broadcastChannel) {
      window.broadcastChannel.postMessage({ type: 'projects_updated', projects: this.projects });
    }
  }

  initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      window.broadcastChannel = new BroadcastChannel('consilience_projects');
      window.broadcastChannel.onmessage = (event) => {
        if (event.data.type === 'projects_updated') {
          this.projects = { ...this.projects, ...event.data.projects };
          localStorage.setItem('consilience_shared_projects', JSON.stringify(event.data.projects));
        }
      };
    }
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
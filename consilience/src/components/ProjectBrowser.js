import React, { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

const ProjectBrowser = ({ walletAddress, onJoinProject }) => {
  const [allProjects, setAllProjects] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load all projects from backend
    const loadProjects = async () => {
      const projects = await projectService.getAllProjects();
      setAllProjects(projects);
    };
    loadProjects();
  }, []);

  const filteredProjects = allProjects.filter(project => {
    if (filter === 'all') return true;
    if (filter === 'recruiting') return project.status === 'recruiting';
    if (filter === 'my-projects') return project.members.includes(walletAddress);
    return project.type.toLowerCase().includes(filter.toLowerCase());
  });

  const handleJoin = async (project) => {
    const success = await projectService.joinProject(project.id, walletAddress);
    if (success) {
      onJoinProject(project);
      const projects = await projectService.getAllProjects();
      setAllProjects(projects);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {['all', 'recruiting', 'my-projects', 'defi', 'nft', 'dao', 'gaming'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 text-sm whitespace-nowrap border transition-colors ${
              filter === filterType
                ? 'border-white bg-white/10 text-white'
                : 'border-white/20 text-white/60 hover:border-white/40'
            }`}
          >
            {filterType.replace('-', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Project List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredProjects.map(project => (
          <div key={project.id} className="minimal-panel p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-white/60">{project.type}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-white/40">
                  {project.members.length}/{project.teamSize} members
                </div>
                <div className={`text-xs px-2 py-1 rounded mt-1 ${
                  project.status === 'recruiting' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'active' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {project.status}
                </div>
              </div>
            </div>
            
            <p className="text-sm text-white/70 mb-3">{project.description}</p>
            
            {project.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {project.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="text-xs px-2 py-1 bg-white/10 rounded">
                    {skill}
                  </span>
                ))}
                {project.skills.length > 4 && (
                  <span className="text-xs text-white/40">+{project.skills.length - 4} more</span>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-white/40">
                Created {new Date(project.createdAt).toLocaleDateString()}
              </div>
              {!project.members.includes(walletAddress) && project.status === 'recruiting' && (
                <button
                  onClick={() => handleJoin(project)}
                  className="text-xs btn-minimal px-3 py-1"
                >
                  Join Project
                </button>
              )}
            </div>
          </div>
        ))}
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-8 text-white/40">
            <p>No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectBrowser;
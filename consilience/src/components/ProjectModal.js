import React, { useState } from 'react';
import { projectService } from '../services/projectService';

const ProjectModal = ({ isOpen, onClose, walletAddress, onProjectCreated }) => {
  const [project, setProject] = useState({
    name: '',
    description: '',
    type: '',
    skills: [],
    teamSize: 3,
    duration: '8-12 weeks'
  });

  const projectTypes = [
    'DeFi Protocol', 'NFT Marketplace', 'DAO Platform', 'Gaming DApp',
    'Social Media DApp', 'Developer Tools', 'Mobile App', 'Web App'
  ];

  const skillOptions = [
    'Rust', 'JavaScript', 'TypeScript', 'Solana', 'React', 'Node.js',
    'Smart Contracts', 'UI/UX Design', 'Product Management', 'Marketing'
  ];

  const handleSkillToggle = (skill) => {
    setProject(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleCreate = async () => {
    if (!project.name || !project.type) return;

    const newProject = await projectService.createProject({
      ...project,
      creator: walletAddress
    });

    if (newProject) {
      onProjectCreated(newProject);
      onClose();
      
      // Reset form
      setProject({
        name: '',
        description: '',
        type: '',
        skills: [],
        teamSize: 3,
        duration: '8-12 weeks'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="minimal-panel p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light glow-text">Create Project</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">×</button>
        </div>

        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Project Name</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => setProject(prev => ({ ...prev, name: e.target.value }))}
              className="minimal-input w-full p-3"
              placeholder="Enter project name"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Project Type</label>
            <select
              value={project.type}
              onChange={(e) => setProject(prev => ({ ...prev, type: e.target.value }))}
              className="minimal-input w-full p-3"
            >
              <option value="">Select project type</option>
              {projectTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
              className="minimal-input w-full p-3 h-24 resize-none"
              placeholder="Describe your project..."
            />
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Required Skills</label>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1 text-sm border transition-colors ${
                    project.skills.includes(skill)
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/20 text-white/60 hover:border-white/40'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Team Size */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Team Size</label>
            <select
              value={project.teamSize}
              onChange={(e) => setProject(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
              className="minimal-input w-full p-3"
            >
              <option value={2}>2 members</option>
              <option value={3}>3 members</option>
              <option value={4}>4 members</option>
              <option value={5}>5 members</option>
              <option value={6}>6+ members</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Estimated Duration</label>
            <select
              value={project.duration}
              onChange={(e) => setProject(prev => ({ ...prev, duration: e.target.value }))}
              className="minimal-input w-full p-3"
            >
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="4-8 weeks">4-8 weeks</option>
              <option value="8-12 weeks">8-12 weeks</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 btn-minimal">
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            disabled={!project.name || !project.type}
            className="flex-1 btn-minimal glow-border disabled:opacity-50"
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
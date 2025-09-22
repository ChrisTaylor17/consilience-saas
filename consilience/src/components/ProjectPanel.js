import React, { useState } from 'react';
import { Plus, Users, Clock, Star, ArrowRight, Briefcase, Code, Palette, Zap } from 'lucide-react';

const ProjectPanel = ({ projects, onCreateProject, onJoinProject, userWallet }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'defi',
    teamSize: 3,
    skills: []
  });

  const projectTypes = [
    { id: 'defi', name: 'DeFi', icon: Zap, color: 'from-green-500 to-emerald-600' },
    { id: 'nft', name: 'NFT', icon: Palette, color: 'from-purple-500 to-pink-600' },
    { id: 'dao', name: 'DAO', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { id: 'infrastructure', name: 'Infrastructure', icon: Code, color: 'from-orange-500 to-red-600' }
  ];

  const skillOptions = [
    'Solana', 'Rust', 'JavaScript', 'React', 'Smart Contracts', 
    'UI/UX Design', 'Product Management', 'Marketing', 'Tokenomics'
  ];

  const handleCreateProject = () => {
    if (!newProject.name.trim() || !newProject.description.trim()) return;
    
    onCreateProject({
      ...newProject,
      id: Date.now(),
      creator: userWallet,
      members: [userWallet],
      status: 'recruiting',
      createdAt: new Date().toISOString()
    });
    
    setNewProject({ name: '', description: '', type: 'defi', teamSize: 3, skills: [] });
    setShowCreateForm(false);
  };

  const toggleSkill = (skill) => {
    setNewProject(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const getProjectTypeInfo = (type) => {
    return projectTypes.find(t => t.id === type) || projectTypes[0];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recruiting': return 'text-green-400 bg-green-400/10';
      case 'active': return 'text-blue-400 bg-blue-400/10';
      case 'completed': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-yellow-400 bg-yellow-400/10';
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Active Projects</h3>
            <p className="text-xs text-gray-400">Collaborate on blockchain projects</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="font-semibold text-white mb-4">Create New Project</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
              <input
                type="text"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Project Type</label>
              <div className="grid grid-cols-2 gap-2">
                {projectTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setNewProject(prev => ({ ...prev, type: type.id }))}
                    className={`p-3 rounded-lg border transition-all flex items-center space-x-2 ${
                      newProject.type === type.id
                        ? 'border-white/40 bg-white/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-gradient-to-br ${type.color} rounded flex items-center justify-center`}>
                      <type.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-white">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      newProject.skills.includes(skill)
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Active Projects</h3>
            <p className="text-gray-500 mb-4">Create your first project to start collaborating</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all"
            >
              Create Project
            </button>
          </div>
        ) : (
          projects.map(project => {
            const typeInfo = getProjectTypeInfo(project.type);
            const isOwner = project.creator === userWallet;
            const isMember = project.members?.includes(userWallet);
            
            return (
              <div key={project.id} className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${typeInfo.color} rounded-lg flex items-center justify-center`}>
                      <typeInfo.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{project.name}</h4>
                      <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{project.members?.length || 1}/{project.teamSize || 5}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    {isOwner && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">Owner</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {project.skills?.slice(0, 3).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
                    {!isMember && project.status === 'recruiting' && (
                      <button
                        onClick={() => onJoinProject(project.id)}
                        className="bg-white text-black px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-all flex items-center space-x-1"
                      >
                        <span>Join</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectPanel;
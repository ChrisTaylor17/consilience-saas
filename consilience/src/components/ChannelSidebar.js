import React from 'react';

const ChannelSidebar = ({ currentChannel, onChannelChange, walletAddress, userProjects, onCreateProject }) => {
  const channels = [
    { id: 'general', name: 'general', description: 'Main discussion' },
    { id: 'project-ideas', name: 'project-ideas', description: 'Brainstorm projects' },
    { id: 'team-formation', name: 'team-formation', description: 'Find collaborators' },
    { id: 'defi', name: 'defi', description: 'DeFi development' },
    { id: 'nft', name: 'nft', description: 'NFT projects' },
    { id: 'dao', name: 'dao', description: 'DAO governance' }
  ];

  const aiChannel = {
    id: `ai-${walletAddress}`,
    name: 'AI Assistant',
    description: 'Private AI chat',
    isAI: true
  };

  return (
    <div className="w-64 border-r border-white/10 p-4">
      <h3 className="text-lg font-light mb-4 text-white/80">Channels</h3>
      
      {/* Public Channels */}
      <div className="space-y-1 mb-6">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChannelChange(channel)}
            className={`w-full text-left p-3 rounded transition-colors ${
              currentChannel?.id === channel.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-white/40">#</span>
              <div>
                <div className="text-sm font-medium">{channel.name}</div>
                <div className="text-xs text-white/40">{channel.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-white/60">Projects</h4>
          <button
            onClick={onCreateProject}
            className="text-xs text-white/40 hover:text-white/60 border border-white/20 px-2 py-1 rounded"
          >
            +
          </button>
        </div>
        <div className="space-y-1">
          {userProjects.map((project) => {
            const projectChannel = {
              id: project.channelId,
              name: project.name,
              description: `${project.type} • ${project.members.length}/${project.teamSize} members`,
              isProject: true,
              project: project
            };
            
            return (
              <button
                key={project.id}
                onClick={() => onChannelChange(projectChannel)}
                className={`w-full text-left p-3 rounded transition-colors ${
                  currentChannel?.id === projectChannel.id
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-white/40">🚀</span>
                  <div>
                    <div className="text-sm font-medium">{project.name}</div>
                    <div className="text-xs text-white/40">{project.type}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Assistant */}
      <div>
        <h4 className="text-sm font-medium text-white/60 mb-2">Direct Messages</h4>
        <button
          onClick={() => onChannelChange(aiChannel)}
          className={`w-full text-left p-3 rounded transition-colors ${
            currentChannel?.id === aiChannel.id
              ? 'bg-white/10 text-white'
              : 'text-white/60 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
              <span className="text-xs">AI</span>
            </div>
            <div>
              <div className="text-sm font-medium">{aiChannel.name}</div>
              <div className="text-xs text-white/40">{aiChannel.description}</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ChannelSidebar;
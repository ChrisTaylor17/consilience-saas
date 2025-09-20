import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Chat from './Chat';
import WalletInfo from './WalletInfo';
import ChannelSidebar from './ChannelSidebar';
import UserProfileModal from './UserProfileModal';
import ProjectModal from './ProjectModal';
import ProjectBrowser from './ProjectBrowser';
import TaskManager from './TaskManager';
import { useSocket } from '../hooks/useSocket';
import { projectService } from '../services/projectService';

const Terminal = () => {
  const { connected, publicKey } = useWallet();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentChannel, setCurrentChannel] = useState({ id: 'general', name: 'general', description: 'Main discussion' });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showProjectBrowser, setShowProjectBrowser] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const socket = useSocket();

  // Check if user has a profile and load projects
  useEffect(() => {
    if (connected && publicKey) {
      const walletAddress = publicKey.toString();
      
      // Load profile
      const savedProfile = localStorage.getItem(`profile_${walletAddress}`);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      } else {
        // Show profile modal for new users
        setTimeout(() => setShowProfileModal(true), 2000);
      }
      
      // Load user projects
      const loadUserProjects = async () => {
        const projects = await projectService.getUserProjects(walletAddress);
        setUserProjects(projects);
      };
      loadUserProjects();
    }
  }, [connected, publicKey, refreshTrigger]);

  const handleProjectCreated = (project) => {
    setRefreshTrigger(prev => prev + 1);
    
    // Switch to the new project channel
    const projectChannel = {
      id: project.channelId,
      name: project.name,
      description: `${project.type} • ${project.members.length}/${project.teamSize} members`,
      isProject: true,
      project: project
    };
    setCurrentChannel(projectChannel);
  };

  const handleJoinProject = (project) => {
    setRefreshTrigger(prev => prev + 1);
    setShowProjectBrowser(false);
    
    // Switch to the joined project channel
    const projectChannel = {
      id: project.channelId,
      name: project.name,
      description: `${project.type} • ${project.members.length}/${project.teamSize} members`,
      isProject: true,
      project: project
    };
    setCurrentChannel(projectChannel);
  };

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black retro-grid">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light glow-text mono">
              CONSILIENCE
            </h1>
            <p className="text-sm text-white/60 mt-1">AI Collaboration Platform</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-xs text-white/40 mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <div className={`status-dot ${connected ? 'opacity-100' : 'opacity-30'}`}></div>
              <span className="text-sm text-white/60">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <WalletMultiButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-100px)]">
        {/* Channel Sidebar */}
        {connected && (
          <ChannelSidebar 
            currentChannel={currentChannel}
            onChannelChange={setCurrentChannel}
            walletAddress={publicKey?.toString()}
            userProjects={userProjects}
            onCreateProject={() => setShowProjectModal(true)}
            onBrowseProjects={() => setShowProjectBrowser(true)}
          />
        )}

        {/* Chat Area */}
        <div className="flex-1">
          {connected ? (
            <div className="h-full flex flex-col">
              {/* Channel Header */}
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center gap-2">
                  {currentChannel?.isAI ? (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white/20 to-white/10 flex items-center justify-center">
                      <span className="text-xs">AI</span>
                    </div>
                  ) : currentChannel?.isProject ? (
                    <span className="text-white/40">🚀</span>
                  ) : (
                    <span className="text-white/40">#</span>
                  )}
                  <h2 className="text-lg font-medium">{currentChannel?.name}</h2>
                  {currentChannel?.isProject && (
                    <span className="text-xs px-2 py-1 bg-white/10 rounded">
                      {currentChannel.project?.status}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/60">{currentChannel?.description}</p>
                  <div className="flex gap-2">
                    {!userProfile && (
                      <button
                        onClick={() => setShowProfileModal(true)}
                        className="text-xs btn-minimal px-3 py-1"
                      >
                        Complete Profile
                      </button>
                    )}
                    {currentChannel?.isProject && (
                      <button
                        onClick={() => setShowProjectBrowser(true)}
                        className="text-xs btn-minimal px-3 py-1"
                      >
                        Browse Projects
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 flex">
                {/* Chat Component */}
                <div className="flex-1">
                  {showProjectBrowser ? (
                    <div className="p-6">
                      <ProjectBrowser 
                        walletAddress={publicKey?.toString()}
                        onJoinProject={handleJoinProject}
                      />
                    </div>
                  ) : (
                    <Chat 
                      walletAddress={publicKey?.toString()} 
                      socket={socket} 
                      currentChannel={currentChannel}
                    />
                  )}
                </div>
                
                {/* Project Task Panel */}
                {currentChannel?.isProject && !showProjectBrowser && (
                  <div className="w-80 border-l border-white/10 p-4">
                    <TaskManager 
                      project={currentChannel.project}
                      walletAddress={publicKey?.toString()}
                      onTaskUpdate={handleTaskUpdate}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mb-6 glow-accent">
                  <div className="w-8 h-8 border border-white/40 rounded-full"></div>
                </div>
                <h3 className="text-xl font-light mb-2">Connect Wallet</h3>
                <p className="text-white/60 mb-8 text-sm">
                  Connect your Solana wallet to begin
                </p>
                <WalletMultiButton />
              </div>
            </div>
          )}
        </div>

        {/* Wallet Info Sidebar */}
        {connected && (
          <div className="w-80 border-l border-white/10 p-6">
            <WalletInfo walletAddress={publicKey?.toString()} />
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        walletAddress={publicKey?.toString()}
        onSave={(profile) => {
        setUserProfile(profile);
        projectService.saveUserProfile(publicKey?.toString(), profile);
      }}
      />
      
      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        walletAddress={publicKey?.toString()}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
};

export default Terminal;
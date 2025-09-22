import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import io from 'socket.io-client';

// Import components
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import ProjectPanel from './components/ProjectPanel';
import TaskManager from './components/TaskManager';
import StatsPanel from './components/StatsPanel';

const FreshApp = () => {
  const { connected, publicKey } = useWallet();
  const [messages, setMessages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userStats, setUserStats] = useState({
    totalProjects: 0,
    completedTasks: 0,
    tokensEarned: 0,
    collaborations: 0,
    reputation: 85,
    activeStreak: 7
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('https://consilience-saas-production.up.railway.app', {
      transports: ['websocket', 'polling']
    });
    
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      if (connected && publicKey) {
        newSocket.emit('user_joined', {
          walletAddress: publicKey.toString(),
          channel: 'general'
        });
      }
    });

    newSocket.on('message', (data) => {
      if (data.message && data.message.sender !== publicKey?.toString()) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    newSocket.on('user_joined', (data) => {
      setOnlineUsers(prev => prev + 1);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => newSocket.close();
  }, [connected, publicKey]);

  // Send message handler
  const handleSendMessage = async (content) => {
    if (!content.trim() || !connected) return;

    const userMessage = {
      id: Date.now(),
      sender: publicKey?.toString(),
      content,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    if (socket) {
      socket.emit('message', { message: userMessage, channel: 'general' });
    }

    // Handle AI commands
    if (content.toLowerCase().startsWith('/ai ')) {
      setIsTyping(true);
      
      try {
        const response = await fetch('https://consilience-saas-production.up.railway.app/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.replace('/ai ', ''),
            walletAddress: publicKey?.toString(),
            currentChannel: { name: 'General', isProject: false }
          })
        });
        
        const result = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'AI_AGENT',
          content: result.response || 'AI response received',
          timestamp: new Date(),
          type: 'ai'
        };

        setMessages(prev => [...prev, aiMessage]);
        
        if (socket) {
          socket.emit('message', { message: aiMessage, channel: 'general' });
        }

        // Handle special AI responses
        if (result.taskCreated) {
          setTasks(prev => [...prev, result.taskCreated]);
        }
        
      } catch (error) {
        console.error('AI error:', error);
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'SYSTEM',
          content: 'AI service temporarily unavailable. Please try again.',
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  // Project handlers
  const handleCreateProject = (projectData) => {
    const newProject = {
      ...projectData,
      id: Date.now(),
      creator: publicKey?.toString(),
      members: [publicKey?.toString()],
      status: 'recruiting',
      createdAt: new Date().toISOString()
    };
    
    setProjects(prev => [...prev, newProject]);
    setUserStats(prev => ({ ...prev, totalProjects: prev.totalProjects + 1 }));
    
    // Send project creation message
    const projectMessage = {
      id: Date.now() + 1,
      sender: 'SYSTEM',
      content: `🚀 **New Project Created!**\n\n**${projectData.name}**\n${projectData.description}\n\nLooking for ${projectData.teamSize} team members with skills: ${projectData.skills.join(', ')}\n\n*Project ID: ${newProject.id}*`,
      timestamp: new Date(),
      type: 'system'
    };
    
    setMessages(prev => [...prev, projectMessage]);
  };

  const handleJoinProject = (projectId) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId && !project.members.includes(publicKey?.toString())) {
        const updatedProject = {
          ...project,
          members: [...project.members, publicKey?.toString()]
        };
        
        // Update status if team is full
        if (updatedProject.members.length >= project.teamSize) {
          updatedProject.status = 'active';
        }
        
        return updatedProject;
      }
      return project;
    }));
    
    setUserStats(prev => ({ ...prev, collaborations: prev.collaborations + 1 }));
  };

  // Task handlers
  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      status: 'todo',
      createdBy: publicKey?.toString(),
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        
        // Update stats if task completed
        if (updates.status === 'completed' && task.status !== 'completed') {
          setUserStats(prevStats => ({
            ...prevStats,
            completedTasks: prevStats.completedTasks + 1,
            tokensEarned: prevStats.tokensEarned + (task.estimatedHours * 10) // 10 tokens per hour
          }));
        }
        
        return updatedTask;
      }
      return task;
    }));
  };

  // Welcome message for new users
  useEffect(() => {
    if (connected && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        sender: 'CONSILIENCE_AI',
        content: `🎉 **Welcome to CONSILIENCE!**\n\nYour AI-powered blockchain collaboration journey starts now.\n\n**Quick Start:**\n• Type \`/ai find cofounder\` to find perfect team matches\n• Type \`/ai create project\` to start a new collaboration\n• Use the project panel to join existing teams\n\n**Your wallet:** ${publicKey?.toString().slice(0, 8)}...${publicKey?.toString().slice(-4)}\n\nReady to build the future of Web3 together? 🚀`,
        timestamp: new Date(),
        type: 'ai'
      };
      
      setMessages([welcomeMessage]);
    }
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header onlineUsers={onlineUsers} activeProjects={projects.length} />
        
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-gradient-to-br from-white to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <span className="text-black font-bold text-2xl">C</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Welcome to CONSILIENCE
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              AI-powered blockchain collaboration platform. Connect your Solana wallet to start building the future together.
            </p>
            
            <div className="space-y-4 text-left bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-white mb-3">What you can do:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Find perfect cofounders with AI matching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Create and manage blockchain projects</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">Earn tokens through collaboration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Real-time team communication</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onlineUsers={onlineUsers} activeProjects={projects.length} />
      
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">
          {/* Main Chat Area */}
          <div className="col-span-12 lg:col-span-6">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              connected={connected}
            />
          </div>
          
          {/* Project Panel */}
          <div className="col-span-12 lg:col-span-3">
            <ProjectPanel
              projects={projects}
              onCreateProject={handleCreateProject}
              onJoinProject={handleJoinProject}
              userWallet={publicKey?.toString()}
            />
          </div>
          
          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Task Manager */}
            <div className="h-1/2">
              <TaskManager
                tasks={tasks}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                userWallet={publicKey?.toString()}
              />
            </div>
            
            {/* Stats Panel */}
            <div className="h-1/2 overflow-y-auto">
              <StatsPanel
                stats={userStats}
                userWallet={publicKey?.toString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreshApp;
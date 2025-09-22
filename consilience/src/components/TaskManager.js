import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, User, Zap, Star, Filter } from 'lucide-react';

const TaskManager = ({ tasks, onAddTask, onUpdateTask, userWallet }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimatedHours: 1,
    skills: [],
    assignee: ''
  });

  const priorities = [
    { id: 'low', name: 'Low', color: 'text-green-400 bg-green-400/10' },
    { id: 'medium', name: 'Medium', color: 'text-yellow-400 bg-yellow-400/10' },
    { id: 'high', name: 'High', color: 'text-red-400 bg-red-400/10' }
  ];

  const skillOptions = [
    'Frontend', 'Backend', 'Smart Contracts', 'UI/UX', 'Testing', 'Documentation'
  ];

  const handleCreateTask = () => {
    if (!newTask.title.trim()) return;
    
    onAddTask({
      ...newTask,
      id: Date.now(),
      status: 'todo',
      createdBy: userWallet,
      createdAt: new Date().toISOString()
    });
    
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      estimatedHours: 1,
      skills: [],
      assignee: ''
    });
    setShowCreateForm(false);
  };

  const toggleTaskStatus = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      onUpdateTask(taskId, { status: newStatus });
    }
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'my': return task.assignee === userWallet || task.createdBy === userWallet;
      case 'todo': return task.status === 'todo';
      case 'completed': return task.status === 'completed';
      default: return true;
    }
  });

  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.id === priority) || priorities[1];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Task Manager</h3>
            <p className="text-xs text-gray-400">Organize and track project tasks</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-6">
        <Filter className="w-4 h-4 text-gray-400" />
        {[
          { id: 'all', name: 'All Tasks' },
          { id: 'my', name: 'My Tasks' },
          { id: 'todo', name: 'To Do' },
          { id: 'completed', name: 'Completed' }
        ].map(filterOption => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filter === filterOption.id
                ? 'bg-white text-black'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {filterOption.name}
          </button>
        ))}
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg">
          <h4 className="font-semibold text-white mb-4">Create New Task</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter task title..."
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the task..."
                rows={2}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                >
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id} className="bg-black">
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Hours</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={newTask.estimatedHours}
                  onChange={(e) => setNewTask(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) }))}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      setNewTask(prev => ({
                        ...prev,
                        skills: prev.skills.includes(skill)
                          ? prev.skills.filter(s => s !== skill)
                          : [...prev.skills, skill]
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      newTask.skills.includes(skill)
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
                onClick={handleCreateTask}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Tasks Found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'Create your first task to get started' : `No ${filter} tasks available`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => {
            const priorityInfo = getPriorityInfo(task.priority);
            const isCompleted = task.status === 'completed';
            const isOwner = task.createdBy === userWallet;
            const isAssigned = task.assignee === userWallet;
            
            return (
              <div key={task.id} className={`p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all ${isCompleted ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1 hover:scale-110 transition-transform"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color}`}>
                      {priorityInfo.name}
                    </span>
                    {isOwner && (
                      <Star className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.estimatedHours}h</span>
                    </div>
                    {task.assignee && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{task.assignee.slice(0, 8)}...</span>
                      </div>
                    )}
                    {(isAssigned || isOwner) && (
                      <span className="text-blue-400 text-xs">
                        {isAssigned ? 'Assigned to you' : 'Created by you'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {task.skills?.slice(0, 2).map(skill => (
                      <span key={skill} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">
                        {skill}
                      </span>
                    ))}
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

export default TaskManager;
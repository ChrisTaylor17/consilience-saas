import React, { useState } from 'react';
import { projectService } from '../services/projectService';

const TaskManager = ({ project, walletAddress, onTaskUpdate }) => {
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' });
  const [showAddTask, setShowAddTask] = useState(false);

  const handleAddTask = async () => {
    if (!newTask.title) return;
    
    const task = await projectService.addTask(project.id, {
      ...newTask,
      assignee: newTask.assignee || walletAddress
    });
    
    if (task) {
      onTaskUpdate();
      setNewTask({ title: '', description: '', assignee: '' });
      setShowAddTask(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    await projectService.updateTaskStatus(project.id, taskId, status);
    onTaskUpdate();
  };

  const tasksByStatus = {
    todo: project.tasks?.filter(t => t.status === 'todo') || [],
    inprogress: project.tasks?.filter(t => t.status === 'inprogress') || [],
    done: project.tasks?.filter(t => t.status === 'done') || []
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tasks</h3>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="text-sm btn-minimal px-3 py-1"
        >
          + Add Task
        </button>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="minimal-panel p-4 space-y-3">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
            className="minimal-input w-full p-2 text-sm"
            placeholder="Task title"
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
            className="minimal-input w-full p-2 text-sm h-16 resize-none"
            placeholder="Task description"
          />
          <select
            value={newTask.assignee}
            onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
            className="minimal-input w-full p-2 text-sm"
          >
            <option value="">Assign to...</option>
            {project.members.map(member => (
              <option key={member} value={member}>
                {member.slice(0, 8)}...{member.slice(-4)}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={handleAddTask} className="btn-minimal px-3 py-1 text-sm">
              Add Task
            </button>
            <button onClick={() => setShowAddTask(false)} className="text-white/60 text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Task Columns */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="space-y-2">
            <h4 className="text-sm font-medium text-white/80 capitalize">
              {status === 'inprogress' ? 'In Progress' : status} ({tasks.length})
            </h4>
            <div className="space-y-2">
              {tasks.map(task => (
                <div key={task.id} className="minimal-panel p-3">
                  <h5 className="text-sm font-medium mb-1">{task.title}</h5>
                  {task.description && (
                    <p className="text-xs text-white/60 mb-2">{task.description}</p>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40">
                      {task.assignee?.slice(0, 8)}...
                    </span>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="bg-transparent border border-white/20 text-xs p-1"
                    >
                      <option value="todo">To Do</option>
                      <option value="inprogress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
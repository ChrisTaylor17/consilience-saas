import React, { useState } from 'react';

const SimpleTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    console.log('Add task clicked, newTask:', newTask);
    if (!newTask.trim()) {
      console.log('Empty task, returning');
      return;
    }
    
    const task = {
      id: Date.now(),
      title: newTask,
      status: 'todo'
    };
    
    console.log('Adding task:', task);
    setTasks(prev => {
      const updated = [...prev, task];
      console.log('Updated tasks:', updated);
      return updated;
    });
    setNewTask('');
  };

  const updateStatus = (id, status) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="p-4 border-l border-white/20">
      <h3 className="text-lg mb-4">Tasks</h3>
      
      <div className="mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="w-full p-2 bg-black border border-white/20 text-white mb-2"
          placeholder="Add new task..."
        />
        <button onClick={addTask} className="px-3 py-1 border border-white/20 text-white">
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-white/60 mb-2">To Do ({todoTasks.length})</h4>
          {todoTasks.map(task => (
            <div key={task.id} className="p-2 border border-white/20 rounded mb-2">
              <div className="flex justify-between items-center">
                <span>{task.title}</span>
                <button 
                  onClick={() => updateStatus(task.id, 'done')}
                  className="text-xs px-2 py-1 border border-white/20"
                >
                  Done
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-sm text-white/60 mb-2">Done ({doneTasks.length})</h4>
          {doneTasks.map(task => (
            <div key={task.id} className="p-2 border border-white/20 rounded mb-2 opacity-60">
              <div className="flex justify-between items-center">
                <span>✅ {task.title}</span>
                <button 
                  onClick={() => updateStatus(task.id, 'todo')}
                  className="text-xs px-2 py-1 border border-white/20"
                >
                  Undo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleTasks;
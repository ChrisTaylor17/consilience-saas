import React, { useState } from 'react';

const TaskPanel = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (!input.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: input,
      done: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  return (
    <div className="w-80 border-l border-white/20 p-4">
      <h3 className="text-lg mb-4 text-white">Tasks</h3>
      
      <div className="mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="w-full p-2 bg-black border border-white/20 text-white mb-2"
          placeholder="Add task..."
        />
        <button 
          onClick={addTask}
          className="px-3 py-1 border border-white/20 text-white hover:bg-white/10"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className={`p-2 border border-white/20 rounded ${task.done ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center text-white">
              <span>{task.done ? '✅ ' : ''}{task.text}</span>
              <button 
                onClick={() => toggleTask(task.id)}
                className="text-xs px-2 py-1 border border-white/20"
              >
                {task.done ? 'Undo' : 'Done'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskPanel;
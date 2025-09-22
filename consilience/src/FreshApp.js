import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import io from 'socket.io-client';

const FreshApp = () => {
  const { connected, publicKey } = useWallet();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('https://consilience-saas-production.up.railway.app');
    setSocket(newSocket);
    
    newSocket.on('message', (data) => {
      if (data.message && data.message.sender !== publicKey?.toString()) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    return () => newSocket.close();
  }, [publicKey]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: publicKey?.toString(),
      content: input,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    if (socket) {
      socket.emit('message', { message: userMessage, channel: 'general' });
    }

    if (input.toLowerCase().startsWith('/ai ')) {
      try {
        const response = await fetch('https://consilience-saas-production.up.railway.app/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input.replace('/ai ', ''),
            walletAddress: publicKey?.toString()
          })
        });
        
        const result = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'AI_AGENT',
          content: result.response,
          timestamp: new Date(),
          type: 'ai'
        };

        setMessages(prev => [...prev, aiMessage]);
        
        if (socket) {
          socket.emit('message', { message: aiMessage, channel: 'general' });
        }
      } catch (error) {
        console.error('AI error:', error);
      }
    }

    setInput('');
  };

  const addTask = () => {
    if (!taskInput.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: taskInput,
      done: false
    };
    
    setTasks(prev => [...prev, newTask]);
    setTaskInput('');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">NUCLEAR FRESH v7.0 - NO CACHE</h1>
          <WalletMultiButton />
        </div>

        {connected ? (
          <div className="grid grid-cols-3 gap-4 h-[80vh]">
            {/* Chat */}
            <div className="col-span-2 border border-white/20 rounded p-4 flex flex-col">
              <h2 className="text-lg mb-4">Chat</h2>
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map(msg => (
                  <div key={msg.id} className="p-2 border border-white/20 rounded">
                    <div className="text-xs text-white/60">{msg.sender}</div>
                    <div>{msg.content}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 p-2 bg-black border border-white/20 text-white"
                  placeholder="Type message... (use /ai for AI)"
                />
                <button onClick={sendMessage} className="px-4 py-2 border border-white/20">
                  Send
                </button>
              </div>
            </div>

            {/* Tasks */}
            <div className="border border-white/20 rounded p-4">
              <h2 className="text-lg mb-4">Tasks</h2>
              <div className="mb-4">
                <input
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  className="w-full p-2 bg-black border border-white/20 text-white mb-2"
                  placeholder="Add task..."
                />
                <button onClick={addTask} className="px-3 py-1 border border-white/20">
                  Add Task
                </button>
              </div>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className={`p-2 border border-white/20 rounded ${task.done ? 'opacity-50' : ''}`}>
                    <div className="flex justify-between items-center">
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
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-xl mb-4">Connect your wallet to start</h2>
            <WalletMultiButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default FreshApp;
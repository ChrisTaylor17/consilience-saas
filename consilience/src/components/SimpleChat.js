import React, { useState, useEffect } from 'react';

const SimpleChat = ({ walletAddress, socket }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (socket) {
      socket.on('message', (data) => {
        console.log('Received message:', data);
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        }
      });
    }
  }, [socket]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: walletAddress,
      content: input,
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);

    // Broadcast to others
    if (socket) {
      socket.emit('message', { message: userMessage, channel: 'general' });
    }

    // Get AI response if starts with /ai
    if (input.startsWith('/ai ')) {
      try {
        const response = await fetch('https://consilience-saas-production.up.railway.app/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: input.replace('/ai ', ''),
            walletAddress
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
        
        // Broadcast AI response
        if (socket) {
          socket.emit('message', { message: aiMessage, channel: 'general' });
        }
      } catch (error) {
        console.error('AI error:', error);
      }
    }

    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className="p-2 border border-white/20 rounded">
            <div className="text-xs text-white/60">{msg.sender}</div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 p-2 bg-black border border-white/20 text-white"
            placeholder="Type message... (use /ai for AI)"
          />
          <button onClick={sendMessage} className="px-4 py-2 border border-white/20 text-white">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleChat;
import React, { useState, useEffect } from 'react';

const SimpleChat = ({ walletAddress, socket }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (socket) {
      console.log('Setting up socket listener');
      socket.on('message', (data) => {
        console.log('CLIENT: Received message:', data);
        if (data.message && data.message.sender !== walletAddress) {
          console.log('Adding message from other user:', data.message);
          setMessages(prev => [...prev, data.message]);
        }
      });
    }
  }, [socket, walletAddress]);

  const sendMessage = async () => {
    console.log('Send message called with input:', input);
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: walletAddress,
      content: input,
      timestamp: new Date(),
      type: 'user'
    };

    console.log('Adding user message:', userMessage);
    setMessages(prev => [...prev, userMessage]);

    // Broadcast to others
    if (socket) {
      console.log('CLIENT: Sending user message via socket:', userMessage);
      socket.emit('message', { message: userMessage, channel: 'general' });
    } else {
      console.log('No socket connection!');
    }

    // Get AI response if starts with /ai
    if (input.toLowerCase().startsWith('/ai ')) {
      console.log('AI request detected, calling API...');
      try {
        const apiCall = {
          message: input.replace('/ai ', ''),
          walletAddress
        };
        console.log('API call data:', apiCall);
        
        const response = await fetch('https://consilience-saas-production.up.railway.app/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(apiCall)
        });
        
        console.log('API response status:', response.status);
        const result = await response.json();
        console.log('API result:', result);
        
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'AI_AGENT',
          content: result.response || 'No response from AI',
          timestamp: new Date(),
          type: 'ai'
        };

        console.log('Adding AI message:', aiMessage);
        setMessages(prev => [...prev, aiMessage]);
        
        // Broadcast AI response to ALL users
        if (socket) {
          console.log('CLIENT: Broadcasting AI message via socket:', aiMessage);
          socket.emit('message', { message: aiMessage, channel: 'general' });
        }
      } catch (error) {
        console.error('AI API error:', error);
        const errorMessage = {
          id: Date.now() + 2,
          sender: 'AI_AGENT',
          content: 'Error connecting to AI service',
          timestamp: new Date(),
          type: 'ai'
        };
        setMessages(prev => [...prev, errorMessage]);
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
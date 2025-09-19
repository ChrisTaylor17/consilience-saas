import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService';
import { blockchainService } from '../services/blockchainService';

const Chat = ({ walletAddress, socket }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage = {
      id: Date.now(),
      sender: 'AI_AGENT',
      content: `WELCOME TO CONSILIENCE, ${walletAddress?.slice(0, 8)}...\nI AM YOUR AI COLLABORATION AGENT.\nTYPE 'HELP' FOR AVAILABLE COMMANDS.`,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages([welcomeMessage]);

    // Temporarily disable socket listeners to fix duplication
    // TODO: Re-enable for multi-user chat once fixed
    if (socket) {
      socket.on('error', (error) => console.error('Socket error:', error));
      return () => {
        socket.off('error');
      };
    }
  }, [walletAddress, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    try {
      if (!inputValue.trim()) return;

      const messageContent = inputValue;
      const userMessage = {
        id: Date.now(),
        sender: walletAddress,
        content: messageContent,
        timestamp: new Date(),
        type: 'user'
      };

      // Add message locally first
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setIsTyping(true);

      // Temporarily disable socket emit to fix duplication
      // TODO: Re-enable for multi-user chat once fixed

      // Only process AI response for the sender, not all users
      try {
        const aiResponse = await aiService.processMessage(messageContent, walletAddress);
        
        const aiMessage = {
          id: Date.now() + 1,
          sender: 'AI_AGENT',
          content: aiResponse,
          timestamp: new Date(),
          type: 'ai'
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('AI response error:', error);
        const errorMessage = {
          id: Date.now() + 1,
          sender: 'AI_AGENT',
          content: 'ERROR: AI SERVICE UNAVAILABLE',
          timestamp: new Date(),
          type: 'ai'
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Message send error:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (message) => {
    try {
      const prefix = message.type === 'system' ? '[SYSTEM]' : 
                    message.type === 'ai' ? '[AI_AGENT]' : 
                    `[${message.sender?.slice(0, 8)}...]`;
      
      const timestamp = message.timestamp ? message.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString();
      
      return `${timestamp} ${prefix}: ${message.content}`;
    } catch (error) {
      console.error('Format message error:', error);
      return `[ERROR]: ${message.content || 'Invalid message'}`;
    }
  };

  return (
    <div className="terminal-border h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-2 whitespace-pre-wrap">
            {formatMessage(message)}
          </div>
        ))}
        {isTyping && (
          <div className="mb-2 opacity-75">
            [AI_AGENT]: PROCESSING<span className="cursor"></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white p-4">
        <div className="flex items-center">
          <span className="mr-2">{'>'}</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono"
            placeholder="TYPE YOUR MESSAGE..."
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 px-4 py-1 border border-white hover:bg-white hover:text-black transition-colors"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
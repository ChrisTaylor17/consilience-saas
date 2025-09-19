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



  return (
    <div className="glass-panel h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-4 rounded-lg ${
              message.type === 'user' ? 'message-user ml-8' :
              message.type === 'ai' ? 'message-ai mr-8' :
              'message-system'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                message.type === 'user' ? 'bg-blue-500' :
                message.type === 'ai' ? 'bg-purple-500' :
                'bg-green-500'
              }`}>
                {message.type === 'user' ? 'U' :
                 message.type === 'ai' ? 'AI' : 'SYS'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {message.type === 'system' ? 'System' : 
                     message.type === 'ai' ? 'AI Agent' : 
                     `${message.sender?.slice(0, 8)}...`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {message.timestamp ? message.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-ai mr-8 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">AI Agent is thinking</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            U
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
            placeholder="Type your message..."
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            className="btn-primary"
            disabled={!inputValue.trim()}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
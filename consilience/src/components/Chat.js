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
    <div className="retro-panel h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <div className={`p-2 ${
              message.type === 'user' ? 'message-user' :
              message.type === 'ai' ? 'message-ai' :
              'message-system'
            }`}>
              <div className="text-xs mb-1 uppercase tracking-wide">
                [{message.timestamp ? message.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}] 
                {message.type === 'system' ? '[SYSTEM]' : 
                 message.type === 'ai' ? '[AI_AGENT]' : 
                 `[${message.sender?.slice(0, 8)}...]`}
              </div>
              <div className="text-sm whitespace-pre-wrap font-mono">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="mb-2">
            <div className="message-ai p-2">
              <div className="text-xs mb-1 uppercase tracking-wide">
                [{new Date().toLocaleTimeString()}] [AI_AGENT]
              </div>
              <div className="text-sm font-mono">
                PROCESSING<span className="cursor"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="neon-border border-t p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm neon-glow">></span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 retro-input p-2 text-sm font-mono uppercase"
            placeholder="TYPE YOUR MESSAGE..."
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            className="btn-retro text-xs"
            disabled={!inputValue.trim()}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
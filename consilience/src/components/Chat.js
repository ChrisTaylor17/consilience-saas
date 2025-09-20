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
      content: `Welcome to Consilience. I'm here to help you collaborate on blockchain projects and connect with teams.`,
      timestamp: new Date(),
      type: 'system'
    };
    setMessages([welcomeMessage]);

    // Socket event listeners for real-time chat
    if (socket) {
      const handleMessage = (message) => {
        try {
          // Only add messages from other users (not yourself)
          if (message && message.content && message.sender !== walletAddress) {
            setMessages(prev => [...prev, message]);
          }
        } catch (error) {
          console.error('Handle message error:', error);
        }
      };

      const handleUserJoined = (data) => {
        try {
          if (data.walletAddress !== walletAddress) {
            const joinMessage = {
              id: Date.now(),
              sender: 'SYSTEM',
              content: `${data.walletAddress?.slice(0, 8)}... joined the chat`,
              timestamp: new Date(),
              type: 'system'
            };
            setMessages(prev => [...prev, joinMessage]);
          }
        } catch (error) {
          console.error('Handle user joined error:', error);
        }
      };

      socket.on('message', handleMessage);
      socket.on('user_joined', handleUserJoined);
      socket.on('error', (error) => console.error('Socket error:', error));

      // Announce user joined
      socket.emit('user_joined', { walletAddress });

      return () => {
        socket.off('message', handleMessage);
        socket.off('user_joined', handleUserJoined);
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

      // Emit user message to other users
      if (socket && socket.connected) {
        socket.emit('message', userMessage);
      }

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
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 p-6">
        {messages.map((message) => (
          <div key={message.id} className="fade-in">
            <div className={`p-4 ${
              message.type === 'user' ? 'message-user ml-12' :
              message.type === 'ai' ? 'message-ai mr-12' :
              'message-system'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-xs text-white/40 mono">
                  {message.timestamp ? message.timestamp.toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
                <div className="text-xs text-white/60">
                  {message.type === 'system' ? 'System' : 
                   message.type === 'ai' ? 'AI' : 
                   message.sender?.slice(0, 8)}
                </div>
              </div>
              <div className="text-sm leading-relaxed text-white/90">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="fade-in">
            <div className="message-ai mr-12 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-xs text-white/40 mono">
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="text-xs text-white/60">AI</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/70">Thinking</span>
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-6">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 minimal-input p-3 text-sm"
            placeholder="Message..."
            maxLength={500}
          />
          <button
            onClick={handleSendMessage}
            className="btn-minimal px-4 py-3 text-sm"
            disabled={!inputValue.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
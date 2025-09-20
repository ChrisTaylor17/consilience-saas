import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService';
import { blockchainService } from '../services/blockchainService';

const Chat = ({ walletAddress, socket, currentChannel }) => {
  const [messagesByChannel, setMessagesByChannel] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get messages for current channel
  const messages = messagesByChannel[currentChannel?.id] || [];
  const setMessages = (updater) => {
    setMessagesByChannel(prev => ({
      ...prev,
      [currentChannel?.id]: typeof updater === 'function' ? updater(prev[currentChannel?.id] || []) : updater
    }));
  };

  useEffect(() => {
    if (!currentChannel) return;

    // Initialize channel with welcome message if empty
    if (!messagesByChannel[currentChannel.id]) {
      let welcomeMessage;
      
      if (currentChannel.isAI) {
        welcomeMessage = {
          id: Date.now(),
          sender: 'AI_AGENT',
          content: `Hello! I'm your personal AI assistant. I can help you with blockchain projects, team formation, and Solana development. What would you like to work on?`,
          timestamp: new Date(),
          type: 'ai'
        };
      } else {
        welcomeMessage = {
          id: Date.now(),
          sender: 'SYSTEM',
          content: `Welcome to #${currentChannel.name}. ${currentChannel.description}.`,
          timestamp: new Date(),
          type: 'system'
        };
      }
      
      setMessages([welcomeMessage]);
    }

    // Socket event listeners for real-time chat (only for public channels)
    if (socket && !currentChannel?.isAI) {
      const handleMessage = (data) => {
        try {
          const { message, channel } = data;
          // Only add messages from other users in the same channel
          if (message && message.content && message.sender && 
              message.sender !== walletAddress && channel === currentChannel.id) {
            const safeMessage = {
              id: message.id || Date.now(),
              sender: message.sender,
              content: message.content,
              timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
              type: message.type || 'user'
            };
            
            setMessagesByChannel(prev => ({
              ...prev,
              [channel]: [...(prev[channel] || []), safeMessage]
            }));
          }
        } catch (error) {
          console.error('Handle message error:', error);
        }
      };

      const handleUserJoined = (data) => {
        try {
          if (data && data.walletAddress && data.walletAddress !== walletAddress && 
              data.channel === currentChannel.id) {
            const joinMessage = {
              id: Date.now(),
              sender: 'SYSTEM',
              content: `${data.walletAddress.slice(0, 8)}... joined #${currentChannel.name}`,
              timestamp: new Date(),
              type: 'system'
            };
            
            setMessagesByChannel(prev => ({
              ...prev,
              [data.channel]: [...(prev[data.channel] || []), joinMessage]
            }));
          }
        } catch (error) {
          console.error('Handle user joined error:', error);
        }
      };

      socket.on('message', handleMessage);
      socket.on('user_joined', handleUserJoined);
      socket.on('error', (error) => console.error('Socket error:', error));

      // Announce user joined this channel
      socket.emit('user_joined', { walletAddress, channel: currentChannel.id });

      return () => {
        socket.off('message', handleMessage);
        socket.off('user_joined', handleUserJoined);
        socket.off('error');
      };
    }
  }, [walletAddress, socket, currentChannel]);

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

      if (currentChannel?.isAI) {
        // AI Channel - always get AI response
        try {
          const aiResponse = await aiService.processMessage(messageContent, walletAddress, true);
          
          if (aiResponse) {
            const aiMessage = {
              id: Date.now() + 1,
              sender: 'AI_AGENT',
              content: aiResponse,
              timestamp: new Date(),
              type: 'ai'
            };

            setMessages(prev => [...prev, aiMessage]);
          }
        } catch (error) {
          console.error('AI response error:', error);
        } finally {
          setIsTyping(false);
        }
      } else {
        // Public Channel - emit to other users and check for AI commands
        if (socket && socket.connected) {
          socket.emit('message', { message: userMessage, channel: currentChannel.id });
        }

        // Check if message was directed to AI
        try {
          const aiResponse = await aiService.processMessage(messageContent, walletAddress);
          
          if (aiResponse) {
            const aiMessage = {
              id: Date.now() + 1,
              sender: 'AI_AGENT',
              content: aiResponse,
              timestamp: new Date(),
              type: 'ai'
            };

            setMessages(prev => [...prev, aiMessage]);
          }
        } catch (error) {
          console.error('AI response error:', error);
        } finally {
          setIsTyping(false);
        }
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
            placeholder={currentChannel?.isAI ? "Message AI assistant..." : "Message... (use /ai for AI assistant)"}
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
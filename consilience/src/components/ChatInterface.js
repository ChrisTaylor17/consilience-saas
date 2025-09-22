import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Zap, Users, Code, Lightbulb } from 'lucide-react';

const ChatInterface = ({ messages, onSendMessage, isTyping, connected }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    { icon: Users, text: "Find me a cofounder", command: "/ai find cofounder" },
    { icon: Code, text: "Create a new project", command: "/ai create project" },
    { icon: Lightbulb, text: "Suggest collaboration", command: "/ai suggest collaboration" },
    { icon: Zap, text: "Generate tasks", command: "/ai create tasks" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !connected) return;
    onSendMessage(input);
    setInput('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (command) => {
    setInput(command);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'ai': return <Bot className="w-4 h-4 text-blue-400" />;
      case 'system': return <Zap className="w-4 h-4 text-green-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatMessage = (content) => {
    // Enhanced message formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-gray-300 italic">$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/🎯|🚀|✅|💡|🤖|👥|📈|🔥/g, '<span class="text-lg">$&</span>');
  };

  return (
    <div className="flex flex-col h-full bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Collaboration Hub</h3>
            <p className="text-xs text-gray-400">Real-time team matching & project creation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Welcome to CONSILIENCE</h3>
            <p className="text-gray-500 mb-6">AI-powered blockchain collaboration starts here</p>
            <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.command)}
                  className="flex items-center space-x-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-left"
                >
                  <suggestion.icon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-300">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`flex space-x-3 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.type !== 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                {getMessageIcon(msg.type)}
              </div>
            )}
            <div className={`max-w-[80%] ${msg.type === 'user' ? 'order-first' : ''}`}>
              <div className={`p-4 rounded-xl ${
                msg.type === 'user' 
                  ? 'bg-white text-black ml-auto' 
                  : msg.type === 'ai'
                  ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50 border border-blue-500/20'
                  : 'bg-white/5 border border-white/10'
              }`}>
                {msg.type !== 'user' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-gray-400">
                      {msg.sender === 'AI_AGENT' ? 'CONSILIENCE AI' : msg.sender}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                <div 
                  className={`text-sm leading-relaxed ${msg.type === 'user' ? 'text-black' : 'text-gray-100'}`}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            </div>
            {msg.type === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-white to-gray-300 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        {showSuggestions && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.command)}
                className="flex items-center space-x-2 p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-left"
              >
                <suggestion.icon className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">{suggestion.text}</span>
              </button>
            ))}
          </div>
        )}
        
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(input === '')}
              placeholder={connected ? "Type your message or use /ai for AI commands..." : "Connect wallet to start chatting"}
              disabled={!connected}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {input && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs text-gray-500">{input.length}/500</span>
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>Use /ai for AI commands • Shift+Enter for new line</span>
          <span>{connected ? 'Connected' : 'Wallet required'}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
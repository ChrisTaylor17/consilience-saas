import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import Chat from './Chat';
import WalletInfo from './WalletInfo';
import { useSocket } from '../hooks/useSocket';

const Terminal = () => {
  const { connected, publicKey } = useWallet();
  const [currentTime, setCurrentTime] = useState(new Date());
  const socket = useSocket();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 25%, #fecfef 75%, #ff9a9e 100%)' }}>
      {/* Floating Hearts */}
      <div className="fixed top-10 left-10 text-4xl floating">🦄</div>
      <div className="fixed top-20 right-20 text-3xl floating" style={{animationDelay: '1s'}}>🌈</div>
      <div className="fixed bottom-20 left-20 text-2xl floating" style={{animationDelay: '2s'}}>💖</div>
      
      {/* Header */}
      <div className="bubble-panel p-6 mb-6 sparkle">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold unicorn-gradient flex items-center gap-3">
              🦄 CONSILIENCE 🌈
            </h1>
            <p className="text-lg text-purple-600 mt-2 font-semibold">✨ Magical AI Collaboration Platform ✨</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-purple-500 font-medium">
              {currentTime.toLocaleString()} 💫
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-lg font-semibold">
            <span className="text-2xl mr-2">{connected ? '💖' : '💔'}</span>
            <span className="text-purple-600">
              {connected ? 'Connected & Happy!' : 'Waiting for Magic...'}
            </span>
          </div>
          <WalletMultiButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 h-[calc(100vh-220px)]">
        {/* Chat Area */}
        <div className="flex-1">
          {connected ? (
            <Chat walletAddress={publicKey?.toString()} socket={socket} />
          ) : (
            <div className="bubble-panel h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-6 floating">🦄</div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">Connect Your Magical Wallet! ✨</h3>
                <p className="text-lg text-purple-500 mb-8 font-medium">
                  🌈 Join the unicorn collaboration adventure! 🌈
                </p>
                <WalletMultiButton />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {connected && (
          <div className="w-80">
            <WalletInfo walletAddress={publicKey?.toString()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
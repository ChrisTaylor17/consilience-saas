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
    <div className="min-h-screen bg-black retro-grid">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-light glow-text mono">
              CONSILIENCE
            </h1>
            <p className="text-sm text-white/60 mt-1">AI Collaboration Platform</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-xs text-white/40 mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="flex items-center gap-2">
              <div className={`status-dot ${connected ? 'opacity-100' : 'opacity-30'}`}></div>
              <span className="text-sm text-white/60">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <WalletMultiButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-100px)]">
        {/* Chat Area */}
        <div className="flex-1 p-6">
          {connected ? (
            <Chat walletAddress={publicKey?.toString()} socket={socket} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center mb-6 glow-accent">
                  <div className="w-8 h-8 border border-white/40 rounded-full"></div>
                </div>
                <h3 className="text-xl font-light mb-2">Connect Wallet</h3>
                <p className="text-white/60 mb-8 text-sm">
                  Connect your Solana wallet to begin
                </p>
                <WalletMultiButton />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {connected && (
          <div className="w-80 border-l border-white/10 p-6">
            <WalletInfo walletAddress={publicKey?.toString()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
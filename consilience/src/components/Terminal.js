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
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)' }}>
      {/* Header */}
      <div className="glass-panel glow-border p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CONSILIENCE
            </h1>
            <p className="text-sm text-gray-400 mt-1">AI-Powered Blockchain Collaboration Platform</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mono">
              {currentTime.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm">
            <span className={`status-indicator ${connected ? 'status-connected' : 'status-disconnected'}`}></span>
            <span className="font-medium">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <WalletMultiButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Chat Area */}
        <div className="flex-1">
          {connected ? (
            <Chat walletAddress={publicKey?.toString()} socket={socket} />
          ) : (
            <div className="glass-panel h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Wallet Connection Required</h3>
                <p className="text-gray-400 mb-6">
                  Connect your Solana wallet to access the collaboration platform
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
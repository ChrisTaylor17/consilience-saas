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
    <div className="min-h-screen bg-black p-4 scanlines">
      {/* Header */}
      <div className="retro-panel p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold neon-glow uppercase tracking-wider">
            CONSILIENCE v1.0
          </h1>
          <div className="text-xs text-white">
            {currentTime.toLocaleString()}
          </div>
        </div>
        <div className="text-xs text-white mb-4 uppercase tracking-wide">
          AI-POWERED BLOCKCHAIN COLLABORATION TERMINAL
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-xs uppercase">
            <span className={`status-indicator ${connected ? 'status-connected' : 'status-disconnected'}`}></span>
            STATUS: {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </div>
          <WalletMultiButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Chat Area */}
        <div className="flex-1">
          {connected ? (
            <Chat walletAddress={publicKey?.toString()} socket={socket} />
          ) : (
            <div className="retro-panel h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 neon-glow">█</div>
                <div className="text-lg mb-2 neon-glow uppercase tracking-wider">WALLET CONNECTION REQUIRED</div>
                <div className="text-xs text-white mb-6 uppercase">
                  CONNECT YOUR SOLANA WALLET TO ACCESS CONSILIENCE
                </div>
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
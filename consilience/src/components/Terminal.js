import React, { useState, useEffect, useRef } from 'react';
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
    <div className="h-screen flex flex-col p-4">
      {/* Header */}
      <div className="terminal-border p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">CONSILIENCE v1.0</h1>
          <div className="text-sm">
            {currentTime.toLocaleString()}
          </div>
        </div>
        <div className="text-sm opacity-75 mb-4">
          AI-POWERED BLOCKCHAIN COLLABORATION TERMINAL
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            STATUS: {connected ? 'CONNECTED' : 'DISCONNECTED'}
          </div>
          <WalletMultiButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4">
        {/* Chat Area */}
        <div className="flex-1">
          {connected ? (
            <Chat walletAddress={publicKey?.toString()} socket={socket} />
          ) : (
            <div className="terminal-border p-4 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl mb-4">WALLET CONNECTION REQUIRED</div>
                <div className="text-sm opacity-75">
                  Connect your Solana wallet to access CONSILIENCE
                </div>
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
import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header = ({ onlineUsers = 0, activeProjects = 0 }) => {
  const { connected, publicKey } = useWallet();

  return (
    <header className="bg-black border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">CONSILIENCE</h1>
                <p className="text-xs text-gray-400 -mt-1">AI-Powered Collaboration</p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">{onlineUsers} Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-300">{activeProjects} Projects</span>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {connected && (
              <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-300">
                  {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </span>
              </div>
            )}
            <WalletMultiButton className="!bg-white !text-black !border-0 !rounded-lg !px-6 !py-2 !font-medium hover:!bg-gray-100 transition-all" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
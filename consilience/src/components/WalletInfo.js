import React, { useState, useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { blockchainService } from '../services/blockchainService';

const WalletInfo = ({ walletAddress }) => {
  const { connection } = useConnection();
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
    tokens: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      try {
        const data = await blockchainService.getWalletInfo(walletAddress, connection);
        setWalletData(data);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
    const interval = setInterval(fetchWalletData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [walletAddress, connection]);

  if (loading) {
    return (
      <div className="glass-panel p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="font-semibold">Wallet Overview</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Address</span>
            <span className="mono text-sm">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Balance</span>
            <span className="font-semibold text-blue-400">{walletData.balance.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Tokens</span>
            <span className="font-semibold">{walletData.tokens.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {walletData.transactions.length > 0 ? (
            walletData.transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="mono text-xs text-gray-400">{tx.signature?.slice(0, 12)}...</span>
                  <span className="text-xs text-gray-500">{new Date(tx.blockTime * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm">{tx.type || 'Transaction'}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Status */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="font-semibold">Project Stats</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-blue-400">0</div>
            <div className="text-xs text-gray-400">Active Projects</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-green-400">0</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-xs text-gray-400">Tokens Earned</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-2xl font-bold text-pink-400">0</div>
            <div className="text-xs text-gray-400">Team Matches</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
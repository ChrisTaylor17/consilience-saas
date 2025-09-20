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
      <div className="bubble-panel p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 floating">🦄</div>
          <p className="text-lg text-purple-600 font-semibold">Loading magical data... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Status */}
      <div className="bubble-panel p-6 sparkle">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">💰</div>
          <h3 className="text-xl font-bold text-purple-600">Magical Wallet ✨</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-500 font-medium">Address</span>
            <span className="text-sm font-mono text-purple-700">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-500 font-medium">Balance</span>
            <span className="font-bold text-purple-700">{walletData.balance.toFixed(4)} SOL 💎</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-500 font-medium">Tokens</span>
            <span className="font-bold text-purple-700">{walletData.tokens.length} 🌈</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bubble-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🎆</div>
          <h3 className="text-xl font-bold text-purple-600">Recent Magic ✨</h3>
        </div>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {walletData.transactions.length > 0 ? (
            walletData.transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 border border-pink-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-purple-600">{tx.signature?.slice(0, 12)}...</span>
                  <span className="text-xs text-purple-500">{new Date(tx.blockTime * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm font-medium text-purple-700">🌈 {tx.type || 'Transaction'}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-purple-500">
              <div className="text-4xl mb-3">🦄</div>
              <p className="font-medium">No magical transactions yet!</p>
            </div>
          )}
        </div>
      </div>

      {/* Project Stats */}
      <div className="bubble-panel p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">🏆</div>
          <h3 className="text-xl font-bold text-purple-600">Unicorn Stats 🦄</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl border border-pink-200">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-purple-500 font-medium">Active Projects 🌈</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-2xl border border-pink-200">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-purple-500 font-medium">Completed ✨</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl border border-pink-200">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-purple-500 font-medium">Tokens Earned 💫</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-pink-100 to-yellow-100 rounded-2xl border border-pink-200">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-purple-500 font-medium">Team Matches 💖</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
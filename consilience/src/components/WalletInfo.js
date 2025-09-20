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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-white/20 rounded-full animate-spin mb-4 glow-accent"></div>
          <p className="text-sm text-white/60">Loading wallet data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="minimal-panel p-6 glow-border">
        <h3 className="text-lg font-light mb-4 glow-text">Wallet</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Address</span>
            <span className="text-xs mono text-white/80">{walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Balance</span>
            <span className="text-white font-medium">{walletData.balance.toFixed(4)} SOL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Tokens</span>
            <span className="text-white font-medium">{walletData.tokens.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="minimal-panel p-6">
        <h3 className="text-lg font-light mb-4 text-white/80">Activity</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {walletData.transactions.length > 0 ? (
            walletData.transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="border-b border-white/10 pb-3 last:border-b-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs mono text-white/40">{tx.signature?.slice(0, 12)}...</span>
                  <span className="text-xs text-white/40">{new Date(tx.blockTime * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm text-white/70">{tx.type || 'Transaction'}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-white/40">
              <p className="text-sm">No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="minimal-panel p-6">
        <h3 className="text-lg font-light mb-4 text-white/80">Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border border-white/10">
            <div className="text-xl font-light text-white">0</div>
            <div className="text-xs text-white/60">Projects</div>
          </div>
          <div className="text-center p-3 border border-white/10">
            <div className="text-xl font-light text-white">0</div>
            <div className="text-xs text-white/60">Completed</div>
          </div>
          <div className="text-center p-3 border border-white/10">
            <div className="text-xl font-light text-white">0</div>
            <div className="text-xs text-white/60">Tokens</div>
          </div>
          <div className="text-center p-3 border border-white/10">
            <div className="text-xl font-light text-white">0</div>
            <div className="text-xs text-white/60">Matches</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
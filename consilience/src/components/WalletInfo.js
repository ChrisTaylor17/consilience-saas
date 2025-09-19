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
      <div className="retro-panel p-4 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg neon-glow mb-2">LOADING WALLET DATA</div>
          <div className="cursor"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Status */}
      <div className="retro-panel p-4">
        <div className="text-sm font-bold mb-2 neon-glow uppercase tracking-wider">WALLET STATUS</div>
        <div className="space-y-1 text-xs font-mono">
          <div>ADDRESS: {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</div>
          <div className="text-white">BALANCE: {walletData.balance.toFixed(4)} SOL</div>
          <div className="text-white">TOKENS: {walletData.tokens.length}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="retro-panel p-4">
        <div className="text-sm font-bold mb-2 neon-glow uppercase tracking-wider">RECENT TRANSACTIONS</div>
        <div className="space-y-2 text-xs max-h-40 overflow-y-auto font-mono">
          {walletData.transactions.length > 0 ? (
            walletData.transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="border-b border-gray-600 pb-1">
                <div className="text-white">HASH: {tx.signature?.slice(0, 8)}...</div>
                <div>TYPE: {tx.type || 'UNKNOWN'}</div>
                <div>TIME: {new Date(tx.blockTime * 1000).toLocaleTimeString()}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-white">
              NO RECENT TRANSACTIONS
            </div>
          )}
        </div>
      </div>

      {/* Project Status */}
      <div className="retro-panel p-4">
        <div className="text-sm font-bold mb-2 neon-glow uppercase tracking-wider">PROJECT STATUS</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="text-white">ACTIVE PROJECTS: 0</div>
          <div className="text-white">COMPLETED TASKS: 0</div>
          <div className="text-white">EARNED TOKENS: 0</div>
          <div className="text-white">TEAM MATCHES: 0</div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
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
      <div className="terminal-border p-4 h-full">
        <div className="text-center">
          LOADING WALLET DATA<span className="cursor"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Wallet Balance */}
      <div className="terminal-border p-4">
        <div className="text-sm font-bold mb-2">WALLET STATUS</div>
        <div className="space-y-1 text-xs">
          <div>ADDRESS: {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-8)}</div>
          <div>BALANCE: {walletData.balance.toFixed(4)} SOL</div>
          <div>TOKENS: {walletData.tokens.length}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="terminal-border p-4">
        <div className="text-sm font-bold mb-2">RECENT TRANSACTIONS</div>
        <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
          {walletData.transactions.length > 0 ? (
            walletData.transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="border-b border-gray-600 pb-1 mb-1">
                <div>HASH: {tx.signature?.slice(0, 8)}...</div>
                <div>TYPE: {tx.type || 'UNKNOWN'}</div>
                <div>TIME: {new Date(tx.blockTime * 1000).toLocaleTimeString()}</div>
              </div>
            ))
          ) : (
            <div className="opacity-75">NO RECENT TRANSACTIONS</div>
          )}
        </div>
      </div>

      {/* Token Holdings */}
      <div className="terminal-border p-4">
        <div className="text-sm font-bold mb-2">TOKEN HOLDINGS</div>
        <div className="space-y-1 text-xs max-h-40 overflow-y-auto">
          {walletData.tokens.length > 0 ? (
            walletData.tokens.map((token, index) => (
              <div key={index} className="border-b border-gray-600 pb-1 mb-1">
                <div>MINT: {token.mint?.slice(0, 8)}...</div>
                <div>AMOUNT: {token.amount}</div>
              </div>
            ))
          ) : (
            <div className="opacity-75">NO TOKENS FOUND</div>
          )}
        </div>
      </div>

      {/* Project Status */}
      <div className="terminal-border p-4">
        <div className="text-sm font-bold mb-2">PROJECT STATUS</div>
        <div className="space-y-1 text-xs">
          <div>ACTIVE PROJECTS: 0</div>
          <div>COMPLETED TASKS: 0</div>
          <div>EARNED TOKENS: 0</div>
          <div>TEAM MATCHES: 0</div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

class BlockchainService {
  constructor() {
    this.connection = new Connection(
      process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com'
    );
  }

  async getWalletInfo(walletAddress, connection = null) {
    try {
      const conn = connection || this.connection;
      const publicKey = new PublicKey(walletAddress);

      // Get balance
      const balance = await conn.getBalance(publicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;

      // Get recent transactions
      const signatures = await conn.getSignaturesForAddress(publicKey, { limit: 10 });
      const transactions = signatures.map(sig => ({
        signature: sig.signature,
        blockTime: sig.blockTime,
        confirmationStatus: sig.confirmationStatus,
        type: this.getTransactionType(sig)
      }));

      // Get token accounts
      const tokenAccounts = await conn.getParsedTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID
      });

      const tokens = tokenAccounts.value.map(account => ({
        mint: account.account.data.parsed.info.mint,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals
      })).filter(token => token.amount > 0);

      return {
        balance: balanceInSol,
        transactions,
        tokens
      };
    } catch (error) {
      console.error('Error fetching wallet info:', error);
      return {
        balance: 0,
        transactions: [],
        tokens: []
      };
    }
  }

  getTransactionType(signature) {
    // Simple transaction type detection based on signature data
    if (signature.memo) {
      return 'MEMO';
    }
    return 'TRANSFER';
  }

  async createTokenMint(walletAddress, amount = 1000) {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/blockchain/mint-tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientWallet: walletAddress, amount, projectId: 'default' })
      });
      return await response.json();
    } catch (error) {
      console.error('Token minting error:', error);
      return { success: false, error: error.message };
    }
  }

  async transferTokens(fromWallet, toWallet, amount, tokenMint) {
    // Placeholder for token transfer logic
    console.log(`Transferring ${amount} tokens from ${fromWallet} to ${toWallet}`);
    return {
      success: true,
      signature: 'PLACEHOLDER_SIGNATURE'
    };
  }

  async getProjectTokenBalance(walletAddress, projectTokenMint) {
    try {
      const publicKey = new PublicKey(walletAddress);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(projectTokenMint)
      });

      if (tokenAccounts.value.length > 0) {
        return tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
      }
      return 0;
    } catch (error) {
      console.error('Error getting project token balance:', error);
      return 0;
    }
  }
}

export const blockchainService = new BlockchainService();
const express = require('express');
const { blockchainService } = require('../services/blockchainService');
const router = express.Router();

// Get wallet information
router.get('/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const walletInfo = await blockchainService.getWalletInfo(address);
    res.json(walletInfo);
  } catch (error) {
    console.error('Get wallet info error:', error);
    res.status(500).json({ error: 'FAILED TO RETRIEVE WALLET INFO' });
  }
});

// Mint project tokens
router.post('/mint-tokens', async (req, res) => {
  try {
    const { recipientWallet, amount, projectId } = req.body;
    
    const result = await blockchainService.mintProjectTokens(
      recipientWallet,
      amount,
      projectId
    );
    
    res.json(result);
  } catch (error) {
    console.error('Mint tokens error:', error);
    res.status(500).json({ error: 'FAILED TO MINT TOKENS' });
  }
});

// Transfer tokens
router.post('/transfer-tokens', async (req, res) => {
  try {
    const { fromWallet, toWallet, amount, tokenMint } = req.body;
    
    const result = await blockchainService.transferTokens(
      fromWallet,
      toWallet,
      amount,
      tokenMint
    );
    
    res.json(result);
  } catch (error) {
    console.error('Transfer tokens error:', error);
    res.status(500).json({ error: 'FAILED TO TRANSFER TOKENS' });
  }
});

// Get project token balance
router.get('/tokens/:walletAddress/:projectId', async (req, res) => {
  try {
    const { walletAddress, projectId } = req.params;
    
    const balance = await blockchainService.getProjectTokenBalance(
      walletAddress,
      projectId
    );
    
    res.json({ balance });
  } catch (error) {
    console.error('Get token balance error:', error);
    res.status(500).json({ error: 'FAILED TO GET TOKEN BALANCE' });
  }
});

module.exports = router;
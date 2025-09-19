#!/bin/bash

echo "Enter your GitHub username:"
read username

echo "Setting up remote origin..."
git remote add origin https://github.com/$username/consilience-saas.git

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 Success! Your repository is now available at:"
echo "https://github.com/$username/consilience-saas"
echo ""
echo "📋 What's included:"
echo "- Complete React frontend with Solana wallet integration"
echo "- Node.js backend with Socket.IO real-time chat"
echo "- AI-powered collaboration features"
echo "- Blockchain token rewards system"
echo "- Production-ready deployment scripts"
echo "- Docker configuration"
echo "- Comprehensive documentation"
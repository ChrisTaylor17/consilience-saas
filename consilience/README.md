# CONSILIENCE

AI-Powered Blockchain Collaboration Terminal

## Overview

CONSILIENCE is a SaaS application that uses AI to guide teams of users in collaborating on blockchain-focused projects, particularly on the Solana blockchain. The application features a retro, minimalist design inspired by old computer terminals with a black-and-white color scheme.

## Features

- **Wallet-Based Authentication**: Users authenticate using Solana wallet addresses
- **AI-Powered Team Matching**: AI analyzes user data to match compatible team members
- **Real-Time Chat Interface**: Terminal-style chat with AI agent participation
- **Blockchain Integration**: Real-time Solana blockchain data and token operations
- **Project Management**: Task tracking and token-based rewards
- **Retro Terminal Design**: Monospace fonts, scanlines, and minimalist aesthetics

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- Solana Wallet Adapter
- Socket.IO Client
- IBM Plex Mono font

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- AWS SDK for cloud services
- Solana Web3.js for blockchain operations

### Cloud Infrastructure
- AWS DynamoDB for data storage
- AWS Bedrock for AI services
- AWS Lambda for serverless functions
- AWS API Gateway for WebSocket connections

## Quick Start

### Prerequisites
- Node.js 18+
- AWS Account with configured credentials
- Solana wallet (Phantom, Solflare, etc.)

### Local Development

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd consilience
npm install
cd backend && npm install && cd ..
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development Servers**
```bash
# Terminal 1 - Frontend
npm start

# Terminal 2 - Backend
cd backend && npm run dev
```

4. **Using Docker (Alternative)**
```bash
docker-compose up
```

### AWS Deployment

1. **Install Serverless Framework**
```bash
npm install -g serverless
```

2. **Configure AWS Credentials**
```bash
aws configure
```

3. **Deploy Backend**
```bash
serverless deploy
```

4. **Deploy Frontend**
```bash
npm run build
# Deploy to S3 + CloudFront or your preferred hosting
```

## Configuration

### Environment Variables

#### Frontend (.env)
```
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_API_URL=https://your-api-gateway-url
REACT_APP_WEBSOCKET_URL=wss://your-websocket-url
```

#### Backend
```
AWS_REGION=us-east-1
DYNAMODB_USERS_TABLE=consilience-users
DYNAMODB_PROJECTS_TABLE=consilience-projects
DYNAMODB_CHATS_TABLE=consilience-chats
BEDROCK_MODEL_ID=anthropic.claude-v2
SOLANA_RPC_URL=https://api.devnet.solana.com
```

## Database Schema

### Users Table (DynamoDB)
```json
{
  "walletAddress": "string (PK)",
  "skills": ["array of strings"],
  "interests": ["array of strings"],
  "experience": "string",
  "projects": ["array of project IDs"],
  "tokensEarned": "number",
  "createdAt": "ISO string",
  "lastActive": "ISO string"
}
```

### Projects Table (DynamoDB)
```json
{
  "projectId": "string (PK)",
  "name": "string",
  "description": "string",
  "creatorWallet": "string (GSI)",
  "teamMembers": ["array of wallet addresses"],
  "status": "string",
  "tasks": ["array of task objects"],
  "tokenAllocations": "object",
  "createdAt": "ISO string"
}
```

## API Endpoints

### AI Routes
- `POST /api/ai/chat` - Process chat messages
- `POST /api/ai/match-team` - Find team members

### User Routes
- `GET /api/users/:walletAddress` - Get user profile
- `POST /api/users` - Create/update profile
- `POST /api/users/:walletAddress/activity` - Log activity

### Project Routes
- `GET /api/projects/user/:walletAddress` - Get user projects
- `POST /api/projects` - Create new project
- `POST /api/projects/:projectId/tasks` - Add task
- `POST /api/projects/:projectId/tasks/:taskId/complete` - Complete task

### Blockchain Routes
- `GET /api/blockchain/wallet/:address` - Get wallet info
- `POST /api/blockchain/mint-tokens` - Mint project tokens
- `POST /api/blockchain/transfer-tokens` - Transfer tokens

## Usage

1. **Connect Wallet**: Click the wallet button to connect your Solana wallet
2. **Chat with AI**: Type messages in the terminal to interact with the AI agent
3. **Available Commands**:
   - `HELP` - Show available commands
   - `BALANCE` - Check wallet balance
   - `PROJECT` - Start new project or view recommendations
   - `TEAM` - Find team members
   - `STATUS` - View current project status

## Security Considerations

- All user authentication is wallet-based
- Sensitive operations require wallet signatures
- Data encryption in transit and at rest
- GDPR/CCPA compliance for user data
- Secure token minting and transfers

## Deployment Architecture

```
Internet → CloudFront → S3 (Frontend)
         ↓
Internet → API Gateway → Lambda (Backend)
         ↓
         DynamoDB (Data Storage)
         ↓
         Bedrock (AI Services)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue in the GitHub repository or contact the development team.
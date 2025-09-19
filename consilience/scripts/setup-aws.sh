#!/bin/bash

# CONSILIENCE AWS Setup Script

echo "Setting up CONSILIENCE AWS Infrastructure..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI not found. Please install AWS CLI first."
    exit 1
fi

# Check if Serverless Framework is installed
if ! command -v serverless &> /dev/null; then
    echo "Installing Serverless Framework..."
    npm install -g serverless
fi

# Set variables
REGION=${AWS_REGION:-us-east-1}
STAGE=${STAGE:-dev}

echo "Using AWS Region: $REGION"
echo "Using Stage: $STAGE"

# Create S3 bucket for frontend hosting
BUCKET_NAME="consilience-frontend-$STAGE-$(date +%s)"
echo "Creating S3 bucket: $BUCKET_NAME"

aws s3 mb s3://$BUCKET_NAME --region $REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document error.html

# Deploy backend using Serverless
echo "Deploying backend services..."
serverless deploy --stage $STAGE --region $REGION

# Create environment file
echo "Creating environment configuration..."
cat > .env << EOF
# AWS Configuration
AWS_REGION=$REGION

# Frontend Configuration
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_API_URL=https://your-api-gateway-url/api
REACT_APP_WEBSOCKET_URL=wss://your-websocket-url

# Backend Configuration
DYNAMODB_USERS_TABLE=consilience-backend-$STAGE-users
DYNAMODB_PROJECTS_TABLE=consilience-backend-$STAGE-projects
DYNAMODB_CHATS_TABLE=consilience-backend-$STAGE-chats
BEDROCK_MODEL_ID=anthropic.claude-v2
BEDROCK_REGION=$REGION
EOF

echo "AWS setup completed!"
echo "S3 Bucket: $BUCKET_NAME"
echo "Please update the API URLs in .env after deployment"
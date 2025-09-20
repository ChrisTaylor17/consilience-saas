#!/bin/bash

# CONSILIENCE Deployment Script

set -e

echo "Deploying CONSILIENCE Application..."

# Build frontend
echo "Building frontend..."
npm run build

# Deploy backend
echo "Deploying backend..."
serverless deploy

# Get API Gateway URL from serverless output
API_URL=$(serverless info --verbose | grep ServiceEndpoint | awk '{print $2}')
echo "API Gateway URL: $API_URL"

# Update environment variables
sed -i.bak "s|REACT_APP_API_URL=.*|REACT_APP_API_URL=$API_URL/api|g" .env

# Rebuild with updated API URL
echo "Rebuilding frontend with API URL..."
npm run build

# Deploy to S3
if [ -n "$S3_BUCKET" ]; then
    echo "Deploying frontend to S3..."
    aws s3 sync build/ s3://$S3_BUCKET --delete
    
    # Invalidate CloudFront cache if distribution exists
    if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        echo "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
    fi
else
    echo "S3_BUCKET not set. Skipping frontend deployment."
fi

echo "Deployment completed!"
echo "Frontend URL: https://$S3_BUCKET.s3-website-us-east-1.amazonaws.com"
echo "API URL: $API_URL"
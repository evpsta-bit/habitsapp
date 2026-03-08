#!/bin/bash
# Pulse Habit Tracker - Deployment Script

echo "🚀 Starting deployment to Firebase..."

# 1. Build the frontend
echo "📦 Building Next.js frontend..."
cd frontend
npm install
npm run build

# 2. Deploy to Firebase
echo "🔥 Deploying to Firebase Hosting..."
cd ..
firebase deploy --only hosting

echo "✅ Deployment complete!"

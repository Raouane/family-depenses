#!/bin/bash
# Script de build pour déployer frontend + backend ensemble sur Render

echo "🔨 Building frontend..."
cd "$(dirname "$0")"
npm install
npm run build

echo "🔨 Building backend..."
cd backend
npm install
npm run build

echo "✅ Build completed!"

#!/bin/bash
# Script de build pour Render
set -e

echo "🔨 Installing frontend dependencies..."
npm install

echo "🔨 Building frontend..."
npx vite build

echo "🔨 Installing backend dependencies..."
cd backend
npm install

echo "🔨 Building backend..."
npm run build

echo "✅ Build completed successfully!"

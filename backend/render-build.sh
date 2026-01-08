#!/bin/bash
# Script de build pour Render
# Ce script est exécuté automatiquement par Render

echo "🔨 Building backend..."

# Installer les dépendances
npm install

# Compiler TypeScript
npm run build

echo "✅ Build completed!"

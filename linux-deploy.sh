#!/bin/bash

# Linux Deployment Script for JasaPembayaran.com
# This script handles the complete deployment process on Ubuntu VPS

set -e  # Exit on any error

echo "🚀 Starting Linux deployment for JasaPembayaran.com..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on Linux
if [[ "$OSTYPE" != "linux-gnu"* ]]; then
    print_error "This script is designed for Linux systems only"
    exit 1
fi

# Set environment variables
export NODE_ENV=production
export NUXT_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384 --max-semi-space-size=512"
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

print_status "Environment variables set for Linux"

# Update system packages
print_status "Updating system packages..."
sudo apt update -y
sudo apt upgrade -y

# Install required system dependencies
print_status "Installing system dependencies..."
sudo apt install -y curl wget git build-essential python3 python3-pip

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Verify Node.js installation
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .nuxt .output dist .nuxt-build .output-build node_modules/.cache

# Install dependencies
print_status "Installing dependencies..."
npm ci --production=false

# Fix Sharp library for Linux
print_status "Fixing Sharp library for Linux..."
npm rebuild sharp

# Run Linux-specific fixes
print_status "Running Linux-specific fixes..."
if [ -f "scripts/fix-all-linux.js" ]; then
    node scripts/fix-all-linux.js
fi

# Build the application
print_status "Building application for production..."
npm run build:production

# Verify build
if [ -d ".output" ]; then
    print_success "Build completed successfully!"
else
    print_error "Build failed - .output directory not found"
    exit 1
fi

# Set up PM2 ecosystem
print_status "Setting up PM2 ecosystem..."
if [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --env production
    pm2 save
    pm2 startup
    print_success "PM2 setup completed!"
else
    print_warning "ecosystem.config.js not found, skipping PM2 setup"
fi

# Set proper permissions
print_status "Setting proper permissions..."
chmod -R 755 .output
chmod +x scripts/*.js 2>/dev/null || true
chmod +x scripts/*.sh 2>/dev/null || true

print_success "🎉 Linux deployment completed successfully!"
print_status "Application should be running on port 3000"
print_status "Use 'pm2 status' to check application status"
print_status "Use 'pm2 logs' to view application logs"

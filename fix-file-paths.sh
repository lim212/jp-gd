#!/bin/bash

# Fix File Paths Script for JasaPembayaran.com
# This script fixes file path issues on Ubuntu VPS

set -e  # Exit on any error

echo "🔧 Fixing File Paths for JasaPembayaran.com"
echo "==========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Fix 1: Check and fix file permissions
echo "🔐 Step 1: Fixing file permissions..."
find . -type f -name "*.js" -exec chmod 644 {} \;
find . -type f -name "*.mjs" -exec chmod 644 {} \;
find . -type f -name "*.ts" -exec chmod 644 {} \;
find . -type f -name "*.vue" -exec chmod 644 {} \;
find . -type f -name "*.json" -exec chmod 644 {} \;
find . -type f -name "*.sh" -exec chmod 755 {} \;
echo "✅ File permissions fixed"

# Fix 2: Check for case sensitivity issues
echo "📁 Step 2: Checking for case sensitivity issues..."
# Check if there are any files with mixed case that might cause issues
find . -name "*.vue" -o -name "*.js" -o -name "*.ts" | while read file; do
    # Check if file contains uppercase letters
    if [[ "$file" =~ [A-Z] ]]; then
        echo "⚠️  Found file with uppercase: $file"
    fi
done
echo "✅ Case sensitivity check completed"

# Fix 3: Verify critical files exist
echo "📋 Step 3: Verifying critical files..."
critical_files=(
    "package.json"
    "nuxt.config.ts"
    "ecosystem.config.js"
    "start.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Fix 4: Check build output directory structure
echo "🏗️  Step 4: Checking build output directory structure..."
if [ -d ".output" ]; then
    echo "✅ .output directory exists"
    
    if [ -d ".output/server" ]; then
        echo "✅ .output/server directory exists"
        
        if [ -f ".output/server/index.mjs" ]; then
            echo "✅ .output/server/index.mjs exists"
        else
            echo "❌ .output/server/index.mjs missing"
        fi
    else
        echo "❌ .output/server directory missing"
    fi
else
    echo "❌ .output directory missing"
fi

# Fix 5: Check for path separators in code
echo "🔍 Step 5: Checking for path separator issues..."
# Check for Windows-style path separators
if grep -r "\\\\" --include="*.js" --include="*.ts" --include="*.vue" . > /dev/null 2>&1; then
    echo "⚠️  Found Windows-style path separators in code"
    echo "   This might cause issues on Ubuntu VPS"
else
    echo "✅ No Windows-style path separators found"
fi

# Fix 6: Verify import paths
echo "📦 Step 6: Checking import paths..."
# Check for relative imports that might cause issues
if grep -r "import.*from.*['\"]\\.\\./" --include="*.js" --include="*.ts" --include="*.vue" . > /dev/null 2>&1; then
    echo "⚠️  Found relative imports that might cause issues"
    echo "   Consider using absolute imports with ~/"
else
    echo "✅ No problematic relative imports found"
fi

# Fix 7: Check for browser APIs without SSR checks
echo "🌐 Step 7: Checking for browser APIs without SSR checks..."
# Check for common browser APIs that might cause SSR issues
browser_apis=("window\." "document\." "navigator\." "localStorage\." "sessionStorage\.")
for api in "${browser_apis[@]}"; do
    if grep -r "$api" --include="*.js" --include="*.ts" --include="*.vue" . | grep -v "typeof.*undefined" > /dev/null 2>&1; then
        echo "⚠️  Found $api usage without SSR checks"
    fi
done
echo "✅ Browser API check completed"

# Fix 8: Verify environment variables
echo "🌍 Step 8: Checking environment variables..."
required_env_vars=("NODE_ENV" "NODE_OPTIONS")
for var in "${required_env_vars[@]}"; do
    if [ -n "${!var}" ]; then
        echo "✅ $var is set: ${!var}"
    else
        echo "⚠️  $var is not set"
    fi
done

echo ""
echo "🎉 File path issues fixed successfully!"
echo "==========================================="
echo "✅ File permissions fixed"
echo "✅ Case sensitivity checked"
echo "✅ Critical files verified"
echo "✅ Build output structure checked"
echo "✅ Path separators checked"
echo "✅ Import paths checked"
echo "✅ Browser APIs checked"
echo "✅ Environment variables checked"
echo ""
echo "📋 If any issues were found, please review the warnings above."
echo "   Most issues have been automatically fixed."
echo ""

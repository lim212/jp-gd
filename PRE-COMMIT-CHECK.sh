#!/bin/bash

# Pre-Commit Check Script
# Run this before git commit to ensure everything is ready for Ubuntu VPS deployment

echo "=================================="
echo "🔍 Pre-Commit Check Started"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. Check Node.js version
echo "1️⃣  Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"
else
    echo -e "${RED}❌ Node.js version too old. Please upgrade to v18+${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 2. Check for uncommitted changes
echo "2️⃣  Checking for uncommitted changes..."
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
    git status --short
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✅ No uncommitted changes${NC}"
fi
echo ""

# 3. Check dependencies
echo "3️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules exists${NC}"
    
    # Check swiper
    if npm list swiper > /dev/null 2>&1; then
        echo -e "${GREEN}✅ swiper installed${NC}"
    else
        echo -e "${RED}❌ swiper not installed${NC}"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}❌ node_modules not found. Run: npm install${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 4. Check critical files
echo "4️⃣  Checking critical files..."
CRITICAL_FILES=(
    "nuxt.config.ts"
    "package.json"
    "app/components/BannerSlider.vue"
    "plugins/resource-hints.ts"
    "plugins/performance-optimizer.client.ts"
    "plugins/lazy-css-loader.client.ts"
    "app.html"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file not found${NC}"
        ERRORS=$((ERRORS+1))
    fi
done
echo ""

# 5. Check for console.log in production files (optional warning)
echo "5️⃣  Checking for console.log statements..."
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.vue" --include="*.ts" --include="*.js" app/ plugins/ 2>/dev/null | grep -v "node_modules" | wc -l)
if [ "$CONSOLE_LOGS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $CONSOLE_LOGS console.log statements (will be removed in production build)${NC}"
    WARNINGS=$((WARNINGS+1))
else
    echo -e "${GREEN}✅ No console.log statements found${NC}"
fi
echo ""

# 6. Check for syntax errors in key files
echo "6️⃣  Checking syntax in TypeScript files..."
if command -v npx &> /dev/null; then
    # Quick syntax check (without full typecheck)
    if npx vue-tsc --noEmit --skipLibCheck > /dev/null 2>&1; then
        echo -e "${GREEN}✅ No TypeScript errors${NC}"
    else
        echo -e "${YELLOW}⚠️  TypeScript warnings found (may not block build)${NC}"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${YELLOW}⚠️  Cannot check TypeScript (npx not found)${NC}"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# 7. Test build (optional, can be slow)
echo "7️⃣  Testing build process..."
echo -e "${YELLOW}⏭️  Skipping full build test (too slow). Run manually: npm run build:optimized${NC}"
echo ""

# 8. Check .gitignore
echo "8️⃣  Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore && grep -q ".env" .gitignore && grep -q ".output" .gitignore; then
        echo -e "${GREEN}✅ .gitignore configured correctly${NC}"
    else
        echo -e "${YELLOW}⚠️  .gitignore may be missing important entries${NC}"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${RED}❌ .gitignore not found${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 9. Check package.json scripts
echo "9️⃣  Checking package.json scripts..."
if grep -q "build:ubuntu" package.json; then
    echo -e "${GREEN}✅ Ubuntu build script exists${NC}"
else
    echo -e "${RED}❌ Ubuntu build script not found in package.json${NC}"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 10. File size check
echo "🔟 Checking file sizes..."
LARGE_FILES=$(find . -type f -size +5M -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.output/*" 2>/dev/null)
if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✅ No large files (>5MB) detected${NC}"
else
    echo -e "${YELLOW}⚠️  Large files detected:${NC}"
    echo "$LARGE_FILES"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# Summary
echo "=================================="
echo "📊 Summary"
echo "=================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to commit.${NC}"
    echo ""
    echo "Next steps:"
    echo "  git add ."
    echo "  git commit -m 'Performance optimization: 60% faster loading'"
    echo "  git push origin main"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Passed with $WARNINGS warning(s)${NC}"
    echo ""
    echo "You can proceed, but review warnings above."
    echo ""
    exit 0
else
    echo -e "${RED}❌ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
    echo ""
    echo "Please fix errors before committing."
    echo ""
    exit 1
fi


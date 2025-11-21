# 🚀 Ubuntu VPS Deployment Checklist

## ✅ Pre-Deployment Verification

### 1. **Code Quality Check** ✅

```bash
# Check for linter errors
npm run dev
# Pastikan tidak ada error di console

# Check for TypeScript errors (jika ada)
npx nuxi typecheck
```

### 2. **Dependencies Check** ✅

```bash
# Verify all dependencies installed
npm install

# Check for vulnerabilities
npm audit

# Update if needed (optional)
# npm audit fix
```

### 3. **Build Test (Local)** ✅

```bash
# Test production build locally
npm run build:optimized

# Or clean build
npm run build:clean

# Start and test
npm run start

# Verify di http://localhost:3000
```

### 4. **File Permissions** ✅

```bash
# Pastikan semua file executable
chmod +x deploy.sh
chmod +x fix-*.sh
chmod +x ubuntu-deploy.sh
chmod +x linux-deploy.sh
```

---

## 📦 Git Deployment

### 1. **Commit All Changes**

```bash
# Check status
git status

# Add all optimized files
git add .

# Commit dengan message yang jelas
git commit -m "Performance optimization: 60% faster loading"

# Push ke repository
git push origin main
```

### 2. **Pull di Ubuntu VPS**

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Navigate ke project directory
cd /path/to/jasapembayaran-new

# Backup current build (optional)
cp -r .output .output.backup

# Pull latest changes
git pull origin main

# Verify changes
git log -1
```

---

## 🔧 Ubuntu VPS Build & Deploy

### 1. **Environment Setup**

```bash
# Update Node.js if needed (Node 18+ recommended)
node --version
npm --version

# Install/update dependencies
npm install

# Verify swiper installed
npm list swiper
```

### 2. **Build for Production**

```bash
# Option 1: Ubuntu optimized build (RECOMMENDED)
npm run build:ubuntu

# Option 2: High performance build
npm run build:high-performance

# Option 3: Clean build
npm run build:ubuntu-clean

# Check build success
ls -la .output
```

### 3. **Deploy with PM2**

```bash
# Stop existing process (if any)
npm run pm2:ubuntu-stop

# Start new process
npm run pm2:ubuntu

# Or use start script
npm run start:ubuntu

# Check status
npm run pm2:status

# Monitor logs
npm run pm2:logs
```

---

## 🧪 Post-Deployment Testing

### 1. **Server Health Check**

```bash
# Check if server running
curl http://localhost:3000

# Check PM2 status
pm2 status

# Check PM2 logs
pm2 logs jasapembayaran-new --lines 50

# Monitor PM2
pm2 monit
```

### 2. **Performance Check**

```bash
# Test from server
curl -o /dev/null -s -w '%{time_total}\n' http://localhost:3000

# Expected: < 1 second
```

### 3. **External Access Check**

```bash
# From your local machine
curl http://your-vps-ip:3000

# Or visit in browser
# http://your-vps-ip:3000
```

### 4. **Nginx Check (if using Nginx)**

```bash
# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Check Nginx status
sudo systemctl status nginx
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Build Fails - Memory Error

**Error**: `JavaScript heap out of memory`

**Solution**:
```bash
# Use Ubuntu build script with increased memory
npm run build:ubuntu

# Or manually set memory
NODE_OPTIONS="--max-old-space-size=16384" npm run build
```

### Issue 2: Sharp Module Error

**Error**: `Error: Could not load the "sharp" module`

**Solution**:
```bash
# Rebuild sharp for Linux
npm rebuild sharp

# Or reinstall
npm uninstall sharp
npm install sharp --platform=linux --arch=x64
```

### Issue 3: Permission Denied

**Error**: `EACCES: permission denied`

**Solution**:
```bash
# Fix permissions
sudo chown -R $USER:$USER .
chmod -R 755 .

# For node_modules
chmod -R 755 node_modules
```

### Issue 4: Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run start
```

### Issue 5: PM2 Not Starting

**Error**: PM2 process exits immediately

**Solution**:
```bash
# Check PM2 logs
pm2 logs jasapembayaran-new --err

# Delete and restart
pm2 delete jasapembayaran-new
npm run pm2:ubuntu

# Check ecosystem config
cat ecosystem.ubuntu.config.js
```

### Issue 6: Swiper Not Loading

**Error**: Swiper component not rendering

**Solution**:
```bash
# Verify swiper installed
npm list swiper

# Reinstall if needed
npm install swiper@latest

# Rebuild
npm run build:ubuntu
```

---

## 📊 Performance Verification

### 1. **Lighthouse Test (from Browser)**

```
1. Open your website in Chrome
2. F12 -> Lighthouse tab
3. Select "Performance"
4. Click "Analyze"

Expected Scores:
- Performance: 90-100 ✅
- Accessibility: 90-100 ✅
- Best Practices: 95-100 ✅
- SEO: 95-100 ✅
```

### 2. **Server Response Time**

```bash
# Test from VPS
time curl http://localhost:3000

# Expected: < 1 second
```

### 3. **Bundle Size Check**

```bash
# Check build output
du -sh .output

# Expected: < 100MB total

# Check JS bundles
du -sh .output/public/_nuxt/*.js

# Expected: Largest chunk < 200KB
```

---

## 🔒 Security Checklist

- [ ] Firewall configured (UFW)
- [ ] SSH key-based authentication only
- [ ] Fail2ban installed and configured
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Nginx security headers configured
- [ ] Regular security updates enabled
- [ ] Environment variables secured (not in git)
- [ ] Database credentials secured
- [ ] Backup system configured

---

## 📝 Environment Variables

Create `.env` file di VPS (NEVER commit to git):

```bash
# Create .env file
nano .env

# Add variables:
NODE_ENV=production
PORT=3000
NUXT_PUBLIC_SITE_URL=https://jasapembayaran.com
WHATSAPP_PHONE=628988888250
# ... other variables
```

---

## 🔄 Continuous Deployment

### Setup Auto-Deploy (Optional)

```bash
# Create deploy script
nano auto-deploy.sh

# Add content:
#!/bin/bash
cd /path/to/jasapembayaran-new
git pull origin main
npm install
npm run build:ubuntu
pm2 restart jasapembayaran-new
echo "Deployment completed at $(date)"

# Make executable
chmod +x auto-deploy.sh

# Setup cron (if needed)
crontab -e

# Add line for daily deploy at 3 AM:
# 0 3 * * * /path/to/auto-deploy.sh >> /var/log/deploy.log 2>&1
```

---

## 📞 Quick Commands Reference

```bash
# Pull & Deploy
git pull && npm install && npm run build:ubuntu && pm2 restart jasapembayaran-new

# Check Status
pm2 status && pm2 logs jasapembayaran-new --lines 20

# Monitor
pm2 monit

# Restart
pm2 restart jasapembayaran-new

# Stop
pm2 stop jasapembayaran-new

# View Logs
pm2 logs jasapembayaran-new

# Full Redeploy
pm2 delete jasapembayaran-new && npm run build:ubuntu-clean && npm run pm2:ubuntu
```

---

## ✅ Final Checklist Before Going Live

- [ ] Code pulled successfully
- [ ] Dependencies installed (npm install)
- [ ] Build completed without errors
- [ ] PM2 process running
- [ ] Website accessible locally (curl localhost:3000)
- [ ] Website accessible externally
- [ ] Nginx configured (if applicable)
- [ ] SSL certificate active (if applicable)
- [ ] Lighthouse score 90+ (Performance)
- [ ] No console errors in browser
- [ ] Mobile responsive working
- [ ] All images loading
- [ ] Swiper slider working
- [ ] WhatsApp button working
- [ ] All pages accessible
- [ ] SEO meta tags present
- [ ] Analytics tracking (if applicable)
- [ ] Backup completed
- [ ] Monitoring active

---

## 🎉 Success Indicators

✅ **PM2 Status**: online  
✅ **Build Size**: < 100MB  
✅ **Response Time**: < 1s  
✅ **Lighthouse Score**: 90+  
✅ **No Console Errors**: ✓  
✅ **All Functions Working**: ✓  

---

**Last Updated**: 2025-01-15  
**Status**: Production Ready  
**Estimated Deployment Time**: 10-15 minutes


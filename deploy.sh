#!/bin/bash

# Pull changes
echo "Pulling changes from git"
git fetch

# Check for changes
current_local_branch=$(git branch --show-current)

echo "Get current remote head...."
remote_head=$(sed 's/\t.*$//' .git/FETCH_HEAD)

echo "Get current local head...."
local_head=$(cat .git/refs/heads/$current_local_branch)

echo "Get latest commit...."
latest_commit=$(git log -1 --oneline)

echo "----------------------------------------------------"
echo "--------------- ⚠️  Starting Deploy -----------------"
echo "----------------------------------------------------"
echo " "

echo "$(date) : Checking for changes"
if [[ $remote_head != $local_head ]]
then
  # Build
  echo "------------- ✅ Building $latest_commit"
  npm run build:production

  # Commit changes
  echo "------------- ✅ Commit changes $latest_commit"
  git add .output
  git commit -m "$(date) Build $latest_commit"

  echo "------------- ✅ Push changes $latest_commit"
  git push origin $current_local_branch

  echo "------------- ✅ Save log $latest_commit"
	echo "$(date) : Build $latest_commit"

  echo "------------- ✅ Pulling data $latest_commit to server"
  ssh root@119.47.89.107 "cd /var/www/jasapembayaran-new && git pull origin main && npm install && npm run build:production && pm2 reload jasapembayaran && exit"

  curl -X POST -H 'Content-Type: application/json' -d '{"chat_id": "704884878", "text": "New Jasapembayaran Deploy Done!!!"}' https://api.telegram.org/bot1999929013:AAGxmJeyP8BKyzLLx6mQC6mC2NEvx2bgnU8/sendMessage
else
  echo "------------- ❌ No changes detected ---------------"
fi

echo " "
echo "----------------------------------------------------"
echo "--------------- ✅ 🥳 Finish Deploy ----------------"
echo "----------------------------------------------------"

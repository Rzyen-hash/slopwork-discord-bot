# 🎮 Adding Slash Commands to Your Bot

## What You're Adding

Three powerful slash commands:
- **`/task [limit]`** - View open tasks from slopwork.xyz (shows 5 by default, up to 10)
- **`/taskinfo`** - Get bot statistics and status
- **`/refresh`** - Manually check for new tasks (admin only)

---

## Step-by-Step Implementation

### Step 1: Get Your Application/Client ID

1. Go to https://discord.com/developers/applications
2. Click your bot application
3. On the **"General Information"** tab
4. Copy the **"Application ID"** (under your app name)
   - It looks like: `1234567890123456789`
   - This is your CLIENT_ID

---

### Step 2: Update Your Local Files

#### A. Replace bot.js

**In your project folder:**

1. **Backup your current bot.js** (just in case):
   ```bash
   cp bot.js bot.js.backup
   ```

2. **Replace bot.js** with the new version I created:
   - Download `bot-with-commands.js` from the files above
   - Rename it to `bot.js`
   - Or copy the entire code and paste into your existing `bot.js`

#### B. Update .env File

Add your CLIENT_ID to `.env`:

```bash
# Edit your .env file
nano .env
# Or use any text editor
```

Add this line:
```
CLIENT_ID=your_application_id_from_step_1
```

Your `.env` should now look like:
```
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GaBcDe.FgHiJk...
CHANNEL_ID=1234567890123456789
CLIENT_ID=9876543210987654321
CHECK_INTERVAL=*/5 * * * *
```

#### C. Update .env.example

```bash
cp .env.example .env.example.backup
```

Update `.env.example` to include:
```
DISCORD_TOKEN=your_discord_bot_token_here
CHANNEL_ID=your_channel_id_here
CLIENT_ID=your_application_id_here
CHECK_INTERVAL=*/5 * * * *
```

---

### Step 3: Test Locally (Recommended)

Before deploying, test on your computer:

```bash
# Install dependencies (if not already done)
npm install

# Start the bot
npm start
```

**What to look for:**
```
✅ Logged in as Slopwork Bot#1234
📊 Monitoring channel: 123456789
⏰ Check interval: */5 * * * *
Started refreshing application (/) commands.
Successfully reloaded application (/) commands.
Checking for new tasks...
```

**Test the commands in Discord:**
1. Type `/task` in any channel
2. You should see the command appear in autocomplete
3. Press Enter - bot fetches and displays tasks!

---

### Step 4: Push Changes to GitHub

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Add slash commands: /task, /taskinfo, /refresh"

# Push to GitHub
git push
```

---

### Step 5: Update Railway Environment Variables

**Railway won't automatically know about CLIENT_ID, you need to add it:**

1. Go to Railway dashboard
2. Click your project
3. Go to **"Variables"** tab
4. Click **"+ New Variable"**
5. Add:
   - **Variable**: `CLIENT_ID`
   - **Value**: Your application ID from Step 1
6. Click **"Add"**

**Railway will automatically redeploy!**

---

### Step 6: Wait for Deployment

1. Go to **"Deployments"** tab in Railway
2. Wait for deployment to complete (~2 minutes)
3. Check logs - should see:
   ```
   Successfully reloaded application (/) commands.
   ```

---

## Using the Commands

### `/task` Command

Shows open tasks from slopwork.xyz

**Basic usage:**
```
/task
```
Shows 5 most recent tasks

**With limit:**
```
/task limit:10
```
Shows up to 10 tasks

**Example output:**
```
📋 Found 8 open task(s) (showing 5):

1. Build AI Trading Bot
Type: Competition
Posted: 2/12/2026
[View on slopwork.xyz]

2. Design Landing Page
Type: RFQ
Posted: 2/11/2026
[View on slopwork.xyz]
...
```

---

### `/taskinfo` Command

Shows bot statistics

**Usage:**
```
/taskinfo
```

**Example output:**
```
🤖 Slopwork Bot Status

📊 Tasks Tracked: 42
⏰ Check Interval: */5 * * * *
🔗 Monitoring: slopwork.xyz
📡 Status: ✅ Online
🕐 Uptime: 2d 5h 23m
💾 Memory: 45MB
```

---

### `/refresh` Command

Manually check for new tasks (requires Administrator permission)

**Usage:**
```
/refresh
```

**Example output:**
```
✅ Manual task check completed! 
Check the monitoring channel for any new tasks.
```

**Note:** Only users with Administrator role can use this.

---

## Troubleshooting

### Commands don't appear in Discord

**Solution 1: Wait a few minutes**
- Discord can take 1-5 minutes to sync commands globally
- Try in a different channel

**Solution 2: Kick and re-invite bot**
1. Right-click bot → Kick
2. Use your OAuth2 URL to re-invite (with `applications.commands` scope)

**Solution 3: Check bot permissions**
- Bot needs `applications.commands` scope
- Re-generate invite URL in Developer Portal

---

### "Application did not respond"

**Possible causes:**
- Bot offline (check Railway logs)
- Network timeout (slopwork.xyz not responding)
- Invalid CLIENT_ID

**Solution:**
```bash
# Check Railway logs
# Railway Dashboard → Deployments → View Logs

# Verify CLIENT_ID is correct
# Should match Application ID in Discord Developer Portal
```

---

### Commands work but show no tasks

**This is normal if:**
- No tasks currently posted on slopwork.xyz
- Website structure changed (scraper needs update)

**Check manually:**
- Visit https://slopwork.xyz/tasks
- See if tasks are there

---

### "/refresh" says permission denied

**This is correct behavior!**
- Only Discord server Administrators can use `/refresh`
- Regular users can only use `/task` and `/taskinfo`

**To give yourself admin:**
1. Right-click your name in Discord
2. Roles → Add Administrator role

---

## What's New in the Code?

### New Features

1. **Slash Command Registration**
   - Automatically registers commands when bot starts
   - Uses Discord's REST API

2. **Interactive Commands**
   - `/task` fetches live data from slopwork.xyz
   - Customizable limit (1-10 tasks)
   - Beautiful embeds with numbered tasks

3. **Bot Statistics**
   - `/taskinfo` shows memory usage, uptime
   - Tracks how many tasks have been seen

4. **Admin Controls**
   - `/refresh` for manual checks
   - Permission checking built-in

5. **Better Error Handling**
   - Graceful failures
   - User-friendly error messages

---

## Testing Checklist

Before considering it done, test:

- [ ] `/task` - Shows tasks
- [ ] `/task limit:3` - Shows 3 tasks
- [ ] `/task limit:10` - Shows max 10 tasks
- [ ] `/taskinfo` - Shows bot stats
- [ ] `/refresh` as admin - Works
- [ ] `/refresh` as non-admin - Shows error
- [ ] Commands appear in autocomplete
- [ ] Bot still auto-posts new tasks every 5 minutes

---

## Advanced Customization

### Change Command Descriptions

Edit in `bot.js`:
```javascript
new SlashCommandBuilder()
  .setName('task')
  .setDescription('Your custom description here')
```

### Add More Commands

Add to the `commands` array:
```javascript
new SlashCommandBuilder()
  .setName('help')
  .setDescription('Show bot help information'),
```

Then handle in the interaction event:
```javascript
else if (commandName === 'help') {
  await interaction.reply({
    content: 'Bot help info here...'
  });
}
```

---

## Next Steps

Now that you have slash commands:

1. ✅ Add more commands (`/help`, `/search`, etc.)
2. ✅ Add buttons for pagination
3. ✅ Add task filtering by type
4. ✅ Add notifications preferences
5. ✅ Create a web dashboard

---

**Congratulations! Your bot now has interactive slash commands!** 🎉

Try it out: Type `/task` in your Discord server!

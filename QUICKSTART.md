# Quick Start Guide 🚀

Get your Slopwork Discord Bot running in 5 minutes!

## Prerequisites

- [Node.js 18+](https://nodejs.org/) installed
- A Discord account
- Admin access to a Discord server

## Step-by-Step Setup

### 1. Download the Bot

```bash
git clone https://github.com/yourusername/slopwork-discord-bot.git
cd slopwork-discord-bot
npm install
```

### 2. Create Your Discord Bot

1. Go to https://discord.com/developers/applications
2. Click **"New Application"**
3. Name it "Slopwork Bot" (or anything you like)
4. Go to **"Bot"** tab → Click **"Add Bot"**
5. Under **Token**, click **"Reset Token"** and **copy it** ⚠️ Keep this secret!

### 3. Invite Bot to Your Server

1. In the Developer Portal, go to **"OAuth2"** → **"URL Generator"**
2. Select **Scopes**: ✅ `bot`
3. Select **Bot Permissions**:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
4. Copy the generated URL and open it in your browser
5. Select your server and authorize

### 4. Get Your Channel ID

1. In Discord, go to **User Settings** → **Advanced** → Enable **Developer Mode**
2. Right-click the channel where you want updates
3. Click **"Copy Channel ID"**

### 5. Configure the Bot

```bash
cp .env.example .env
```

Edit `.env` and paste your values:
```env
DISCORD_TOKEN=your_token_here
CHANNEL_ID=your_channel_id_here
```

### 6. Start the Bot!

```bash
npm start
```

You should see:
```
✅ Logged in as Slopwork Bot#1234
📊 Monitoring channel: 123456789
⏰ Check interval: */5 * * * *
Checking for new tasks...
```

## Testing

To verify everything works:

```bash
npm test
```

## Docker (Optional)

If you prefer Docker:

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Troubleshooting

### "Invalid Token"
- Double-check your DISCORD_TOKEN in `.env`
- Make sure you copied the entire token

### "Missing Access"
- Verify the bot is in your server
- Check the bot has permissions in the channel

### "No tasks found"
- This is normal if no new tasks were posted
- The bot will check every 5 minutes

## Next Steps

- ⚙️ Customize check interval in `.env`
- 📚 Read the full [README.md](README.md)
- 🤝 Join our [Discussions](https://github.com/yourusername/slopwork-discord-bot/discussions)
- ⭐ Star the repo!

## Need Help?

- Check [Common Issues](https://github.com/yourusername/slopwork-discord-bot/issues)
- Ask in [Discussions](https://github.com/yourusername/slopwork-discord-bot/discussions)
- Read the [Contributing Guide](CONTRIBUTING.md)

---

**Happy monitoring! 🎉**

# Slopwork Discord Bot 🤖

A Discord bot that monitors [slopwork.xyz](https://slopwork.xyz) for new tasks and posts updates to your Discord server.

## Features

✅ **Automatic Task Monitoring** - Checks for new tasks every 5 minutes (configurable)  
✅ **Rich Embeds** - Beautiful Discord embeds with task details  
✅ **Bid Alerts** - Notifications when bids are accepted or tasks are funded  
✅ **Smart Caching** - Avoids duplicate posts using persistent storage  
✅ **Easy Configuration** - Simple environment variable setup  
✅ **Open Source** - MIT licensed, contributions welcome!

## Preview

The bot posts task updates like this:

```
🆕 New Task: Build AI-powered trading bot
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Create a Solana trading bot with ML predictions...

Type: Competition
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Prerequisites

- Node.js 18 or higher
- A Discord bot token
- A Discord server where you have admin permissions

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/slopwork-discord-bot.git
cd slopwork-discord-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" section and click "Add Bot"
4. Under "Token", click "Reset Token" and copy it (you'll need this)
5. Enable these **Privileged Gateway Intents**:
   - ❌ Presence Intent (not needed)
   - ❌ Server Members Intent (not needed)
   - ❌ Message Content Intent (not needed)
6. Go to "OAuth2" → "URL Generator"
7. Select scopes:
   - ✅ `bot`
8. Select bot permissions:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
9. Copy the generated URL and open it to invite the bot to your server

### 4. Get Channel ID

1. Enable Developer Mode in Discord (User Settings → Advanced → Developer Mode)
2. Right-click on the channel where you want task updates
3. Click "Copy Channel ID"

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
DISCORD_TOKEN=your_bot_token_here
CHANNEL_ID=your_channel_id_here
CHECK_INTERVAL=*/5 * * * *
```

### 6. Run the Bot

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## Configuration

### Check Interval

The `CHECK_INTERVAL` uses cron syntax. Examples:

```bash
# Every minute
CHECK_INTERVAL=* * * * *

# Every 5 minutes (default)
CHECK_INTERVAL=*/5 * * * *

# Every 10 minutes
CHECK_INTERVAL=*/10 * * * *

# Every hour
CHECK_INTERVAL=0 * * * *

# Every day at 9 AM
CHECK_INTERVAL=0 9 * * *
```

## How It Works

1. **Task Discovery**: The bot periodically checks slopwork.xyz for new tasks
2. **Deduplication**: Uses a local cache (`task_cache.json`) to track seen tasks
3. **Discord Posts**: New tasks are posted as rich embeds to your specified channel
4. **Bid Monitoring**: Tracks task status changes for bid acceptance and funding

## Project Structure

```
slopwork-discord-bot/
├── bot.js              # Main bot logic
├── package.json        # Dependencies
├── .env.example        # Environment template
├── .env               # Your configuration (git-ignored)
├── task_cache.json    # Task tracking (auto-generated)
└── README.md          # This file
```

## Development

### Testing

```bash
npm test
```

### Adding Features

The bot is designed to be easily extended. Key functions:

- `fetchTasks()` - Scrapes slopwork.xyz for tasks
- `fetchTasksFromAPI()` - Checks for API endpoints (future-proof)
- `createTaskEmbed()` - Formats task embeds
- `postTask()` - Posts to Discord

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment

### Deploy to a Server

1. **Using PM2** (recommended):
```bash
npm install -g pm2
pm2 start bot.js --name slopwork-bot
pm2 save
pm2 startup
```

2. **Using systemd**:
Create `/etc/systemd/system/slopwork-bot.service`:
```ini
[Unit]
Description=Slopwork Discord Bot
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/slopwork-discord-bot
ExecStart=/usr/bin/node bot.js
Restart=always

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable slopwork-bot
sudo systemctl start slopwork-bot
```

### Deploy to Cloud Platforms

#### Railway
1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push

#### Heroku
```bash
heroku create your-bot-name
heroku config:set DISCORD_TOKEN=your_token
heroku config:set CHANNEL_ID=your_channel_id
git push heroku main
```

#### Replit
1. Import GitHub repo to Replit
2. Add secrets in Secrets tab
3. Click Run

## Troubleshooting

### Bot doesn't start
- ✅ Check that your `DISCORD_TOKEN` is correct
- ✅ Ensure Node.js version is 18 or higher: `node --version`
- ✅ Verify all dependencies installed: `npm install`

### No tasks appearing
- ✅ Verify `CHANNEL_ID` is correct
- ✅ Check bot has permissions in the channel
- ✅ Ensure slopwork.xyz is accessible
- ✅ Check console logs for errors

### Duplicate posts
- ✅ Delete `task_cache.json` to reset cache
- ✅ Check if multiple bot instances are running

## API Support

Currently, the bot uses web scraping since slopwork.xyz may not have a public API. If an API becomes available:

1. Update `fetchTasksFromAPI()` with the correct endpoint
2. The bot will automatically use API over scraping
3. Consider adding webhook support for real-time updates

## Roadmap

- [ ] Webhook support for real-time updates
- [ ] Bid tracking and notifications
- [ ] Task filtering by type/category
- [ ] Multi-channel support
- [ ] Web dashboard for configuration
- [ ] Database integration for historical data
- [ ] User command interface (`!tasks`, `!search`, etc.)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- 🐛 Report bugs: [GitHub Issues](https://github.com/yourusername/slopwork-discord-bot/issues)
- 💬 Questions: [Discussions](https://github.com/yourusername/slopwork-discord-bot/discussions)
- 🌟 Star the repo if you find it useful!

## Acknowledgments

- Built for the [slopwork.xyz](https://slopwork.xyz) community
- Powered by [discord.js](https://discord.js.org/)
- Created with ❤️ for the Solana ecosystem

---

**Note**: This bot is not officially affiliated with slopwork.xyz. It's a community tool to enhance the platform experience.

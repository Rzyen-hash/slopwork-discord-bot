# Deployment Guide 🚀

This guide covers deploying the Slopwork Discord Bot to production environments.

## Table of Contents

- [Cloud Platforms](#cloud-platforms)
  - [Railway](#railway)
  - [Heroku](#heroku)
  - [Render](#render)
  - [Fly.io](#flyio)
  - [DigitalOcean](#digitalocean)
- [VPS/Dedicated Server](#vpsdedicated-server)
  - [Using PM2](#using-pm2)
  - [Using systemd](#using-systemd)
  - [Using Docker](#using-docker)
- [Best Practices](#best-practices)

---

## Cloud Platforms

### Railway

Railway is recommended for its simplicity and free tier.

**Steps:**

1. Create account at [railway.app](https://railway.app)

2. Create new project from GitHub repo

3. Add environment variables:
   ```
   DISCORD_TOKEN=your_token
   CHANNEL_ID=your_channel_id
   CHECK_INTERVAL=*/5 * * * *
   ```

4. Deploy automatically on push

**Custom Deployment:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

**Pricing:** Free tier includes $5/month credit

---

### Heroku

**Steps:**

1. Create Heroku account at [heroku.com](https://heroku.com)

2. Install Heroku CLI:
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Other platforms
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

3. Login and create app:
   ```bash
   heroku login
   heroku create your-bot-name
   ```

4. Add Procfile:
   ```
   worker: node bot.js
   ```

5. Set config vars:
   ```bash
   heroku config:set DISCORD_TOKEN=your_token
   heroku config:set CHANNEL_ID=your_channel_id
   ```

6. Deploy:
   ```bash
   git push heroku main
   heroku ps:scale worker=1
   ```

7. View logs:
   ```bash
   heroku logs --tail
   ```

**Pricing:** Eco dynos $5/month (doesn't sleep)

---

### Render

**Steps:**

1. Create account at [render.com](https://render.com)

2. Create new **Background Worker**

3. Connect GitHub repository

4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node bot.js`

5. Add environment variables in dashboard

6. Deploy

**Pricing:** Free tier available (with limitations)

---

### Fly.io

**Steps:**

1. Install flyctl:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login:
   ```bash
   flyctl auth login
   ```

3. Create fly.toml:
   ```toml
   app = "slopwork-bot"
   
   [build]
     builder = "heroku/buildpacks:20"
   
   [[services]]
     internal_port = 8080
     protocol = "tcp"
   ```

4. Set secrets:
   ```bash
   flyctl secrets set DISCORD_TOKEN=your_token
   flyctl secrets set CHANNEL_ID=your_channel_id
   ```

5. Deploy:
   ```bash
   flyctl deploy
   ```

**Pricing:** Free tier with 3 shared VMs

---

### DigitalOcean

**Using App Platform:**

1. Create account at [digitalocean.com](https://digitalocean.com)

2. Create new **App** from GitHub

3. Choose **Worker** component type

4. Set environment variables

5. Deploy

**Pricing:** Basic plan $5/month

---

## VPS/Dedicated Server

For Ubuntu/Debian servers with full control.

### Using PM2

**Recommended for production.**

1. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Install PM2:
   ```bash
   sudo npm install -g pm2
   ```

3. Clone and setup:
   ```bash
   git clone https://github.com/yourusername/slopwork-discord-bot.git
   cd slopwork-discord-bot
   npm install --production
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. Start with PM2:
   ```bash
   pm2 start bot.js --name slopwork-bot
   ```

5. Configure auto-restart:
   ```bash
   pm2 startup
   pm2 save
   ```

6. Useful PM2 commands:
   ```bash
   pm2 logs slopwork-bot     # View logs
   pm2 restart slopwork-bot  # Restart
   pm2 stop slopwork-bot     # Stop
   pm2 delete slopwork-bot   # Remove
   pm2 monit                 # Monitor
   ```

---

### Using systemd

**For system-level service management.**

1. Create service file:
   ```bash
   sudo nano /etc/systemd/system/slopwork-bot.service
   ```

2. Add configuration:
   ```ini
   [Unit]
   Description=Slopwork Discord Bot
   After=network.target
   
   [Service]
   Type=simple
   User=ubuntu
   WorkingDirectory=/home/ubuntu/slopwork-discord-bot
   ExecStart=/usr/bin/node bot.js
   Restart=always
   RestartSec=10
   StandardOutput=syslog
   StandardError=syslog
   SyslogIdentifier=slopwork-bot
   Environment=NODE_ENV=production
   
   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable slopwork-bot
   sudo systemctl start slopwork-bot
   ```

4. Manage service:
   ```bash
   sudo systemctl status slopwork-bot
   sudo systemctl restart slopwork-bot
   sudo systemctl stop slopwork-bot
   sudo journalctl -u slopwork-bot -f  # View logs
   ```

---

### Using Docker

**Portable containerized deployment.**

1. Build image:
   ```bash
   docker build -t slopwork-bot .
   ```

2. Run container:
   ```bash
   docker run -d \
     --name slopwork-bot \
     --restart unless-stopped \
     -e DISCORD_TOKEN=your_token \
     -e CHANNEL_ID=your_channel_id \
     -v $(pwd)/task_cache.json:/usr/src/app/task_cache.json \
     slopwork-bot
   ```

3. Using Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Manage container:
   ```bash
   docker logs -f slopwork-bot      # View logs
   docker restart slopwork-bot      # Restart
   docker stop slopwork-bot         # Stop
   docker rm slopwork-bot           # Remove
   ```

---

## Best Practices

### Environment Variables

✅ **Never commit .env to git**
```bash
# Already in .gitignore
.env
```

✅ **Use secrets management** for production:
- Cloud platforms: Use their secrets/env vars UI
- VPS: Use environment variables or tools like Vault

### Monitoring

✅ **Set up logging:**
```bash
# PM2
pm2 install pm2-logrotate

# systemd
sudo journalctl -u slopwork-bot --since "1 hour ago"
```

✅ **Monitor uptime:**
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Set up health check endpoint
- Monitor Discord webhook

✅ **Error notifications:**
```javascript
// Add to bot.js
process.on('uncaughtException', (error) => {
  console.error('FATAL ERROR:', error);
  // Send alert to Discord admin
});
```

### Security

✅ **Keep dependencies updated:**
```bash
npm audit
npm update
```

✅ **Use non-root user:**
```bash
# Create dedicated user
sudo useradd -m -s /bin/bash slopbot
sudo -u slopbot npm start
```

✅ **Set up firewall:**
```bash
sudo ufw allow ssh
sudo ufw enable
```

### Performance

✅ **Optimize check interval:**
- Don't check too frequently (API limits)
- Balance freshness vs. load
- Consider webhook alternative

✅ **Enable caching:**
```bash
# In .env
CACHE_HTML=true
```

✅ **Monitor memory:**
```bash
pm2 monit
# Or use `htop`
```

### Backup

✅ **Backup cache file:**
```bash
# Cron job
0 0 * * * cp /path/to/task_cache.json /path/to/backup/
```

✅ **Version control:**
```bash
git remote add origin your-private-repo
git push -u origin main
```

### Updates

✅ **Pull latest changes:**
```bash
cd slopwork-discord-bot
git pull
npm install
pm2 restart slopwork-bot
```

✅ **Zero-downtime updates:**
```bash
pm2 reload slopwork-bot
```

---

## Troubleshooting Production Issues

### Bot keeps crashing

Check logs:
```bash
pm2 logs slopwork-bot --lines 100
```

Common issues:
- Invalid token
- Network issues
- Memory limit
- Rate limiting

### High memory usage

Monitor:
```bash
pm2 monit
```

Solutions:
- Restart periodically: `pm2 restart slopwork-bot --cron "0 4 * * *"`
- Increase server resources
- Optimize check interval

### Rate limiting

Symptoms:
- 429 errors in logs
- Tasks not posting

Solutions:
- Increase CHECK_INTERVAL
- Add delays between requests
- Use caching

---

## Cost Comparison

| Platform | Free Tier | Paid Plan | Best For |
|----------|-----------|-----------|----------|
| Railway | $5/month credit | $5+/month | Beginners |
| Heroku | No free tier | $5/month | Simplicity |
| Render | Limited | $7/month | Small bots |
| Fly.io | 3 VMs free | $1.94+/month | Budget |
| DigitalOcean | None | $5/month | Control |
| VPS | Varies | $5+/month | Power users |

---

## Support

Need help deploying?

- 📖 Check [README.md](README.md)
- 💬 Ask in [Discussions](https://github.com/yourusername/slopwork-discord-bot/discussions)
- 🐛 Report issues on [GitHub](https://github.com/yourusername/slopwork-discord-bot/issues)

---

**Happy deploying! 🎉**

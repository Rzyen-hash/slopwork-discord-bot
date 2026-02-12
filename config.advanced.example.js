// config.advanced.js - Advanced configuration example
// Copy this to config.js and customize as needed

module.exports = {
  // Discord Configuration
  discord: {
    token: process.env.DISCORD_TOKEN,
    channelId: process.env.CHANNEL_ID,
    
    // Optional: Use different channels for different task types
    channels: {
      rfq: process.env.CHANNEL_RFQ || process.env.CHANNEL_ID,
      competition: process.env.CHANNEL_COMPETITION || process.env.CHANNEL_ID,
      general: process.env.CHANNEL_ID
    },
    
    // Embed customization
    embedColors: {
      newTask: 0x00ff00,      // Green
      bidAccepted: 0xffaa00,  // Orange
      taskFunded: 0x0099ff,   // Blue
      taskComplete: 0x9933ff  // Purple
    },
    
    // Mention roles when new tasks posted (optional)
    mentionRoles: process.env.MENTION_ROLES?.split(',') || []
  },

  // Slopwork Configuration
  slopwork: {
    baseUrl: 'https://slopwork.xyz',
    tasksUrl: 'https://slopwork.xyz/tasks',
    
    // API configuration (if available)
    api: {
      enabled: false,
      endpoint: '/api/v1/tasks',
      apiKey: process.env.SLOPWORK_API_KEY
    },
    
    // Task filtering
    filters: {
      // Only post tasks of these types (empty = all types)
      taskTypes: process.env.FILTER_TYPES?.split(',') || [],
      
      // Minimum bounty to post (in SOL)
      minBounty: parseFloat(process.env.MIN_BOUNTY || 0),
      
      // Keywords to include/exclude
      includeKeywords: process.env.INCLUDE_KEYWORDS?.split(',') || [],
      excludeKeywords: process.env.EXCLUDE_KEYWORDS?.split(',') || []
    }
  },

  // Monitoring Configuration
  monitoring: {
    // Check interval in cron format
    checkInterval: process.env.CHECK_INTERVAL || '*/5 * * * *',
    
    // Enable bid tracking
    trackBids: process.env.TRACK_BIDS !== 'false',
    
    // Bid check interval (separate from task check)
    bidCheckInterval: process.env.BID_CHECK_INTERVAL || '*/10 * * * *',
    
    // Retry configuration
    retries: {
      maxAttempts: parseInt(process.env.MAX_RETRIES || 3),
      delayMs: parseInt(process.env.RETRY_DELAY || 5000)
    },
    
    // Rate limiting
    rateLimit: {
      maxRequestsPerMinute: parseInt(process.env.MAX_REQUESTS_PER_MIN || 10),
      delayBetweenRequests: parseInt(process.env.REQUEST_DELAY || 1000)
    }
  },

  // Storage Configuration
  storage: {
    // Cache file location
    cacheFile: process.env.CACHE_FILE || './task_cache.json',
    
    // Optional: Use database instead of file
    database: {
      enabled: process.env.USE_DATABASE === 'true',
      type: process.env.DB_TYPE || 'sqlite', // sqlite, postgres, mysql
      connection: process.env.DATABASE_URL
    },
    
    // Cache cleanup
    cleanup: {
      // Remove tasks older than X days from cache
      olderThanDays: parseInt(process.env.CACHE_CLEANUP_DAYS || 30),
      
      // Run cleanup interval
      interval: process.env.CLEANUP_INTERVAL || '0 0 * * *' // Daily
    }
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info', // debug, info, warn, error
    
    // Log to file
    file: {
      enabled: process.env.LOG_TO_FILE === 'true',
      path: process.env.LOG_FILE || './logs/bot.log',
      maxSize: '10m',
      maxFiles: 5
    },
    
    // Log to external service (optional)
    external: {
      enabled: process.env.LOG_EXTERNAL === 'true',
      service: process.env.LOG_SERVICE, // e.g., 'datadog', 'sentry'
      apiKey: process.env.LOG_API_KEY
    }
  },

  // Notifications Configuration
  notifications: {
    // Send summary at specific times
    dailySummary: {
      enabled: process.env.DAILY_SUMMARY === 'true',
      time: process.env.SUMMARY_TIME || '18:00',
      timezone: process.env.TZ || 'UTC'
    },
    
    // Alert on errors
    errorAlerts: {
      enabled: process.env.ERROR_ALERTS === 'true',
      channelId: process.env.ERROR_CHANNEL_ID,
      mentionUserId: process.env.ADMIN_USER_ID
    },
    
    // Webhook notifications (for other services)
    webhooks: {
      enabled: process.env.WEBHOOKS_ENABLED === 'true',
      urls: process.env.WEBHOOK_URLS?.split(',') || []
    }
  },

  // Performance Optimization
  performance: {
    // Batch multiple updates
    batching: {
      enabled: process.env.BATCH_UPDATES === 'true',
      maxBatchSize: parseInt(process.env.BATCH_SIZE || 5),
      batchDelayMs: parseInt(process.env.BATCH_DELAY || 2000)
    },
    
    // Caching
    cache: {
      // Cache parsed HTML
      htmlCache: process.env.CACHE_HTML === 'true',
      htmlCacheTTL: parseInt(process.env.HTML_CACHE_TTL || 60000) // 1 minute
    }
  },

  // Development/Testing
  development: {
    isDev: process.env.NODE_ENV === 'development',
    
    // Use test channels in development
    testChannelId: process.env.TEST_CHANNEL_ID,
    
    // Dry run mode (don't actually post to Discord)
    dryRun: process.env.DRY_RUN === 'true',
    
    // Mock data for testing
    useMockData: process.env.USE_MOCK_DATA === 'true'
  }
};

/* 
EXAMPLE .env FILE FOR ADVANCED CONFIGURATION:

# Basic Configuration
DISCORD_TOKEN=your_token_here
CHANNEL_ID=123456789

# Advanced Channels
CHANNEL_RFQ=111111111
CHANNEL_COMPETITION=222222222

# Filtering
FILTER_TYPES=rfq,competition
MIN_BOUNTY=0.5
INCLUDE_KEYWORDS=ai,solana,smart-contract
EXCLUDE_KEYWORDS=spam,test

# Monitoring
CHECK_INTERVAL=*/3 * * * *
TRACK_BIDS=true
BID_CHECK_INTERVAL=*/15 * * * *

# Storage
USE_DATABASE=true
DB_TYPE=postgres
DATABASE_URL=postgresql://user:pass@localhost:5432/slopwork

# Logging
LOG_LEVEL=debug
LOG_TO_FILE=true
LOG_FILE=./logs/bot.log

# Notifications
DAILY_SUMMARY=true
SUMMARY_TIME=17:00
ERROR_ALERTS=true
ERROR_CHANNEL_ID=987654321
ADMIN_USER_ID=123456789

# Performance
BATCH_UPDATES=true
BATCH_SIZE=10
CACHE_HTML=true

# Development
NODE_ENV=production
DRY_RUN=false
*/

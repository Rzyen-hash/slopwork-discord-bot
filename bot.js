const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const fs = require('fs').promises;

// Configuration
const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID,
  CHECK_INTERVAL: process.env.CHECK_INTERVAL || '*/5 * * * *', // Every 5 minutes by default
  SLOPWORK_URL: 'https://slopwork.xyz',
  TASKS_URL: 'https://slopwork.xyz/tasks',
  CACHE_FILE: './task_cache.json'
};

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

// Task cache to track seen tasks
let taskCache = new Set();

// Load cache from file
async function loadCache() {
  try {
    const data = await fs.readFile(CONFIG.CACHE_FILE, 'utf8');
    taskCache = new Set(JSON.parse(data));
    console.log(`Loaded ${taskCache.size} tasks from cache`);
  } catch (error) {
    console.log('No existing cache found, starting fresh');
    taskCache = new Set();
  }
}

// Save cache to file
async function saveCache() {
  try {
    await fs.writeFile(CONFIG.CACHE_FILE, JSON.stringify([...taskCache]));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
}

// Fetch tasks from slopwork.xyz
async function fetchTasks() {
  try {
    const response = await axios.get(CONFIG.TASKS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const tasks = [];

    // Parse the HTML to extract task information
    // This selector will need to be adjusted based on actual HTML structure
    $('.task-item, [class*="task"], article').each((i, elem) => {
      const $elem = $(elem);
      
      // Try to extract task information
      const title = $elem.find('h1, h2, h3, h4, .title, [class*="title"]').first().text().trim();
      const description = $elem.find('p, .description, [class*="description"]').first().text().trim();
      const link = $elem.find('a').first().attr('href');
      const type = $elem.find('[class*="type"], .badge, .tag').first().text().trim();
      
      if (title && link) {
        const fullLink = link.startsWith('http') ? link : `${CONFIG.SLOPWORK_URL}${link}`;
        tasks.push({
          id: link, // Use link as unique identifier
          title,
          description,
          link: fullLink,
          type,
          timestamp: new Date().toISOString()
        });
      }
    });

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    return [];
  }
}

// Alternative: Check if there's a JSON API endpoint
async function fetchTasksFromAPI() {
  try {
    // Try potential API endpoints
    const endpoints = [
      '/api/tasks',
      '/api/v1/tasks',
      '/tasks.json'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${CONFIG.SLOPWORK_URL}${endpoint}`);
        if (response.data && Array.isArray(response.data)) {
          return response.data;
        }
      } catch (e) {
        // Try next endpoint
        continue;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Create Discord embed for task
function createTaskEmbed(task) {
  const embed = new EmbedBuilder()
    .setTitle(`🆕 New Task: ${task.title}`)
    .setURL(task.link)
    .setColor(0x00ff00)
    .setTimestamp();

  if (task.description) {
    embed.setDescription(task.description.substring(0, 4096));
  }

  if (task.type) {
    embed.addFields({ name: 'Type', value: task.type, inline: true });
  }

  embed.setFooter({ text: 'Slopwork.xyz Task Monitor' });

  return embed;
}

// Create embed for bid update
function createBidUpdateEmbed(task, updateType) {
  const color = updateType === 'accepted' ? 0xffaa00 : 0x0099ff;
  const emoji = updateType === 'accepted' ? '✅' : '💰';
  const title = updateType === 'accepted' ? 'Bid Accepted' : 'Task Funded';

  const embed = new EmbedBuilder()
    .setTitle(`${emoji} ${title}: ${task.title}`)
    .setURL(task.link)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: 'Slopwork.xyz Task Monitor' });

  if (task.description) {
    embed.setDescription(task.description.substring(0, 4096));
  }

  return embed;
}

// Post task to Discord
async function postTask(task) {
  try {
    const channel = await client.channels.fetch(CONFIG.CHANNEL_ID);
    const embed = createTaskEmbed(task);
    await channel.send({ embeds: [embed] });
    console.log(`Posted new task: ${task.title}`);
  } catch (error) {
    console.error('Error posting to Discord:', error.message);
  }
}

// Check for new tasks
async function checkNewTasks() {
  console.log('Checking for new tasks...');
  
  // Try API first, fall back to scraping
  let tasks = await fetchTasksFromAPI();
  if (!tasks) {
    tasks = await fetchTasks();
  }

  const newTasks = tasks.filter(task => !taskCache.has(task.id));

  if (newTasks.length > 0) {
    console.log(`Found ${newTasks.length} new task(s)`);
    
    for (const task of newTasks) {
      await postTask(task);
      taskCache.add(task.id);
      
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await saveCache();
  } else {
    console.log('No new tasks found');
  }
}

// Bot ready event
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`📊 Monitoring channel: ${CONFIG.CHANNEL_ID}`);
  console.log(`⏰ Check interval: ${CONFIG.CHECK_INTERVAL}`);
  
  await loadCache();
  
  // Initial check
  await checkNewTasks();
  
  // Schedule periodic checks
  cron.schedule(CONFIG.CHECK_INTERVAL, async () => {
    await checkNewTasks();
  });
});

// Handle errors
client.on('error', error => {
  console.error('Discord client error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

// Start the bot
client.login(CONFIG.DISCORD_TOKEN);

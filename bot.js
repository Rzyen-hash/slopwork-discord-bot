const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const fs = require('fs').promises;

// Configuration
const CONFIG = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CHANNEL_ID: process.env.CHANNEL_ID,
  CLIENT_ID: process.env.CLIENT_ID, // Your bot's application ID
  CHECK_INTERVAL: process.env.CHECK_INTERVAL || '*/5 * * * *',
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
    $('.task-item, [class*="task"], article').each((i, elem) => {
      const $elem = $(elem);
      
      const title = $elem.find('h1, h2, h3, h4, .title, [class*="title"]').first().text().trim();
      const description = $elem.find('p, .description, [class*="description"]').first().text().trim();
      const link = $elem.find('a').first().attr('href');
      const type = $elem.find('[class*="type"], .badge, .tag').first().text().trim();
      
      if (title && link) {
        const fullLink = link.startsWith('http') ? link : `${CONFIG.SLOPWORK_URL}${link}`;
        tasks.push({
          id: link,
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
        continue;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Create Discord embed for task
function createTaskEmbed(task, index) {
  const embed = new EmbedBuilder()
    .setTitle(`${index ? `${index}. ` : '🆕 New Task: '}${task.title}`)
    .setURL(task.link)
    .setColor(0x00ff00)
    .setTimestamp();

  if (task.description) {
    embed.setDescription(task.description.substring(0, 4096));
  }

  if (task.type) {
    embed.addFields({ name: 'Type', value: task.type, inline: true });
  }

  if (task.timestamp) {
    embed.addFields({ 
      name: 'Posted', 
      value: new Date(task.timestamp).toLocaleDateString(), 
      inline: true 
    });
  }

  embed.setFooter({ text: 'Slopwork.xyz Task Monitor' });

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
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await saveCache();
  } else {
    console.log('No new tasks found');
  }
}

// Register slash commands
async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('task')
      .setDescription('View open tasks from slopwork.xyz')
      .addIntegerOption(option =>
        option.setName('limit')
          .setDescription('Number of tasks to show (default: 5, max: 10)')
          .setRequired(false)
          .setMinValue(1)
          .setMaxValue(10)
      ),
    new SlashCommandBuilder()
      .setName('taskinfo')
      .setDescription('Get bot status and statistics'),
    new SlashCommandBuilder()
      .setName('refresh')
      .setDescription('Manually check for new tasks (admin only)')
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(CONFIG.DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(CONFIG.CLIENT_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    if (commandName === 'task') {
      await interaction.deferReply();

      const limit = interaction.options.getInteger('limit') || 5;

      // Fetch current tasks
      let tasks = await fetchTasksFromAPI();
      if (!tasks || tasks.length === 0) {
        tasks = await fetchTasks();
      }

      if (tasks.length === 0) {
        await interaction.editReply({
          content: '❌ No tasks found on slopwork.xyz at the moment.',
        });
        return;
      }

      // Limit tasks to requested amount
      const displayTasks = tasks.slice(0, limit);

      // Create embeds for each task
      const embeds = displayTasks.map((task, index) => 
        createTaskEmbed(task, index + 1)
      );

      // Discord has a limit of 10 embeds per message
      if (embeds.length > 10) {
        embeds.length = 10;
      }

      await interaction.editReply({
        content: `📋 **Found ${tasks.length} open task(s)** (showing ${displayTasks.length}):`,
        embeds: embeds
      });

    } else if (commandName === 'taskinfo') {
      await interaction.deferReply();

      const embed = new EmbedBuilder()
        .setTitle('🤖 Slopwork Bot Status')
        .setColor(0x0099ff)
        .addFields(
          { name: '📊 Tasks Tracked', value: `${taskCache.size}`, inline: true },
          { name: '⏰ Check Interval', value: CONFIG.CHECK_INTERVAL, inline: true },
          { name: '🔗 Monitoring', value: '[slopwork.xyz](https://slopwork.xyz)', inline: true },
          { name: '📡 Status', value: '✅ Online', inline: true },
          { name: '🕐 Uptime', value: formatUptime(process.uptime()), inline: true },
          { name: '💾 Memory', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: 'Slopwork.xyz Task Monitor' });

      await interaction.editReply({ embeds: [embed] });

    } else if (commandName === 'refresh') {
      // Check if user has admin permissions
      if (!interaction.memberPermissions.has('Administrator')) {
        await interaction.reply({
          content: '❌ You need Administrator permissions to use this command.',
          ephemeral: true
        });
        return;
      }

      await interaction.deferReply();
      
      await checkNewTasks();
      
      await interaction.editReply({
        content: '✅ Manual task check completed! Check the monitoring channel for any new tasks.'
      });
    }
  } catch (error) {
    console.error('Error handling command:', error);
    const errorMessage = '❌ An error occurred while processing your command.';
    
    if (interaction.deferred) {
      await interaction.editReply({ content: errorMessage });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '<1m';
}

// Bot ready event
client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  console.log(`📊 Monitoring channel: ${CONFIG.CHANNEL_ID}`);
  console.log(`⏰ Check interval: ${CONFIG.CHECK_INTERVAL}`);
  
  await loadCache();
  await registerCommands();
  
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

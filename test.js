const axios = require('axios');
const cheerio = require('cheerio');

const SLOPWORK_URL = 'https://slopwork.xyz';
const TASKS_URL = 'https://slopwork.xyz/tasks';

console.log('🧪 Testing Slopwork Discord Bot...\n');

// Test 1: Check if slopwork.xyz is accessible
async function testWebsiteAccess() {
  console.log('1️⃣ Testing website accessibility...');
  try {
    const response = await axios.get(SLOPWORK_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      console.log('   ✅ Website is accessible');
      return true;
    } else {
      console.log(`   ❌ Unexpected status code: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
}

// Test 2: Check if tasks page exists
async function testTasksPage() {
  console.log('\n2️⃣ Testing tasks page...');
  try {
    const response = await axios.get(TASKS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    if (response.status === 200) {
      console.log('   ✅ Tasks page is accessible');
      return response.data;
    } else {
      console.log(`   ❌ Unexpected status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return null;
  }
}

// Test 3: Try to parse tasks
async function testTaskParsing(html) {
  console.log('\n3️⃣ Testing task parsing...');
  try {
    const $ = cheerio.load(html);
    
    // Try different selectors to find tasks
    const selectors = [
      '.task-item',
      '[class*="task"]',
      'article',
      '[data-task]',
      '.card'
    ];
    
    let tasksFound = 0;
    let bestSelector = null;
    
    for (const selector of selectors) {
      const count = $(selector).length;
      if (count > tasksFound) {
        tasksFound = count;
        bestSelector = selector;
      }
    }
    
    if (tasksFound > 0) {
      console.log(`   ✅ Found ${tasksFound} potential tasks using selector: ${bestSelector}`);
      
      // Try to extract some data
      console.log('\n   Sample task data:');
      $(bestSelector).first().each((i, elem) => {
        const $elem = $(elem);
        const title = $elem.find('h1, h2, h3, h4, .title').first().text().trim();
        const description = $elem.find('p').first().text().trim();
        const link = $elem.find('a').first().attr('href');
        
        console.log(`   📋 Title: ${title || 'Not found'}`);
        console.log(`   📝 Description: ${description.substring(0, 50) || 'Not found'}...`);
        console.log(`   🔗 Link: ${link || 'Not found'}`);
      });
      
      return true;
    } else {
      console.log('   ⚠️  No tasks found with common selectors');
      console.log('   💡 The HTML structure may need custom parsing');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Error parsing: ${error.message}`);
    return false;
  }
}

// Test 4: Check for API endpoints
async function testAPIEndpoints() {
  console.log('\n4️⃣ Testing potential API endpoints...');
  
  const endpoints = [
    '/api/tasks',
    '/api/v1/tasks',
    '/tasks.json',
    '/api/tasks.json'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${SLOPWORK_URL}${endpoint}`, {
        timeout: 5000
      });
      
      if (response.status === 200 && response.data) {
        console.log(`   ✅ Found API endpoint: ${endpoint}`);
        console.log(`   📊 Response type: ${typeof response.data}`);
        return true;
      }
    } catch (error) {
      // Endpoint doesn't exist, continue
    }
  }
  
  console.log('   ℹ️  No API endpoints found (will use web scraping)');
  return false;
}

// Test 5: Verify dependencies
function testDependencies() {
  console.log('\n5️⃣ Testing dependencies...');
  
  const requiredModules = [
    'axios',
    'cheerio',
    'discord.js',
    'node-cron',
    'dotenv'
  ];
  
  let allInstalled = true;
  
  for (const module of requiredModules) {
    try {
      require.resolve(module);
      console.log(`   ✅ ${module}`);
    } catch (e) {
      console.log(`   ❌ ${module} - NOT INSTALLED`);
      allInstalled = false;
    }
  }
  
  return allInstalled;
}

// Run all tests
async function runTests() {
  console.log('═══════════════════════════════════════\n');
  
  const deps = testDependencies();
  
  if (!deps) {
    console.log('\n❌ Missing dependencies. Run: npm install');
    return;
  }
  
  const access = await testWebsiteAccess();
  if (!access) {
    console.log('\n❌ Cannot access slopwork.xyz. Check your internet connection.');
    return;
  }
  
  const html = await testTasksPage();
  if (html) {
    await testTaskParsing(html);
  }
  
  await testAPIEndpoints();
  
  console.log('\n═══════════════════════════════════════');
  console.log('\n📝 Next steps:');
  console.log('   1. Copy .env.example to .env');
  console.log('   2. Add your DISCORD_TOKEN and CHANNEL_ID');
  console.log('   3. Run: npm start');
  console.log('\n═══════════════════════════════════════\n');
}

runTests().catch(console.error);

# Use Node.js LTS
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# Copy package files first for better caching
COPY package*.json ./

RUN npm install --omit=dev
# Copy app source
COPY . .

# Create cache file if it doesn't exist
RUN touch task_cache.json

# Run as non-root user
USER node

# Start the bot
CMD ["node", "bot.js"]

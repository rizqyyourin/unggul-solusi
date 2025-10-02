# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Copy and setup entrypoint script
RUN chmod +x docker-entrypoint.sh

# Expose port 5173 (Vite default)
EXPOSE 5173

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
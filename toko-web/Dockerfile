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

# Expose port 5173 (Vite default)
EXPOSE 5173

# Start development server directly
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3006

# Set environment to production
ENV NODE_ENV=production

# Start the backend server
CMD ["npm", "start"]
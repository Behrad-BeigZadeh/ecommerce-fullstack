# Use an official Node.js runtime as a parent image
FROM node:18

# Set working directory to /app
WORKDIR /app

# Copy package.json and .env
COPY ./package*.json ./
COPY ./.env ./

# Copy backend source files
COPY server/ ./

# Install dependencies
RUN npm install

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

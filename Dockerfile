# Use Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose React dev server port
EXPOSE 8081

# Start the dev server
CMD ["npm", "run", "dev", "--", "--port", "8081", "--host"]

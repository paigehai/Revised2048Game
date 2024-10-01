# Use a specific version of Node.js
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if it exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port (if your app listens on a specific port)
EXPOSE 8070

# Command to run the application
CMD ["npm", "start"]

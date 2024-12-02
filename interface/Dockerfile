# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the production-ready application
RUN npm run build

# Expose the port the app will run on
EXPOSE 4173

# Command to serve the application
CMD ["npm", "run", "preview"]

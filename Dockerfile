# Step 1: Use the official Node.js image from Docker Hub
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application to the container
COPY . .

# Step 6: Expose the application’s port (3000)
EXPOSE 3000

# Step 7: Run the application
CMD ["node", "index.js"]
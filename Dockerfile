# Use an official Node.js runtime as a base image
FROM node:20-alpine


WORKDIR /src
COPY . .

# Install dependencies using yarn
RUN npm install --legacy-peer-deps

# Build the app
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
# Use an official Node.js runtime as a base image
FROM node:20-alpine


WORKDIR /src
COPY . .

# Install dependencies using yarn
RUN npm install --legacy-peer-deps

#env
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ROLL_BAR_ACCESS_TOKEN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ROLL_BAR_ACCESS_TOKEN=$NEXT_PUBLIC_ROLL_BAR_ACCESS_TOKEN

# Build the app
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]

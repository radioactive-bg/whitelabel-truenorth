# Use an official Node.js runtime as a base image
FROM node:20-alpine

# Install dependencies required for Cypress
RUN apk add --no-cache \
    xvfb \
    gtk+3.0 \
    libnotify \
    libgconf \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn

WORKDIR /src
COPY . .

# Install dependencies using npm
RUN npm install --legacy-peer-deps

#env
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ROLL_BAR_ACCESS_TOKEN
ARG CYPRESS_PROJECT_ID
ARG CYPRESS_RECORD_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ROLL_BAR_ACCESS_TOKEN=$NEXT_PUBLIC_ROLL_BAR_ACCESS_TOKEN
ENV CYPRESS_PROJECT_ID=$CYPRESS_PROJECT_ID
ENV CYPRESS_RECORD_KEY=$CYPRESS_RECORD_KEY

# Build the app
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
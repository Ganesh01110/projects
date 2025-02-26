# Use Node.js as the base image
FROM node:18-slim

# Set working directory inside the container
WORKDIR /app

# Install OpenSSL (Fix for Prisma)
#RUN apt-get update -y && apt-get install -y openssl

# Install required system dependencies (including MySQL client)
RUN apt-get update -y && apt-get install -y openssl mariadb-client

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Copy .env file
COPY .env .env

# Install dependencies
#RUN npm ci --omit=dev
#RUN npm install --only=prod


# Copy compiled TypeScript files (dist/)
#COPY dist ./dist

# Copy proto files
#COPY protos ./protos

# Copy Prisma schema and migrations
#COPY prisma ./prisma
#COPY ./prisma/*.prisma ./prisma/

COPY . .


#RUN npm ci --omit=dev
RUN npm install

RUN npm run generate:all

#RUN npx prisma generate


# Expose necessary ports (adjust based on service)
EXPOSE 3001 50051 50052

# Start the service
#CMD ["sh", "-c", "sleep 10 && npm start"]
#CMD ["sh", "-c", "sleep 10 && npm run dbpull:all && npm run migrate:all && npm run generate:all && npm start"]
#CMD ["sh", "-c", "sleep 10 && npm run dbpull:all && npm run migrate:all && npm run generate:all && sleep 2 && npm start"]
CMD ["sh", "-c", "sleep 10 && npm run dbpull:all && npm run migrate:all &&  sleep 2 && npm start"]

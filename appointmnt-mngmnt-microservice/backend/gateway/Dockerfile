# Use an official Node.js image
FROM node:18-slim

# Set working directory specific to the service
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
#RUN npm ci --omit=dev
RUN npm install --only=prod


# Copy compiled TypeScript files (dist/)
COPY dist ./dist

# Set environment variables from Docker Compose
#ARG SERVICE_PORT
#ARG USER_PROTO_PORT
#ARG APPOINTMENT_PROTO_PORT

#ENV PORT=$SERVICE_PORT
#ENV USER_PROTO_PORT=$USER_PROTO_PORT
#ENV APPOINTMENT_PROTO_PORT=$APPOINTMENT_PROTO_PORT

# Expose the port for this service
EXPOSE 3000
#EXPOSE $PORT $USER_PROTO_PORT $APPOINTMENT_PROTO_PORT

# Start the service
CMD ["npm", "start"]

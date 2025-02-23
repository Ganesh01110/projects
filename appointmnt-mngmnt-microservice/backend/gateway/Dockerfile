# Use an official Node.js image
FROM node:18

# Set working directory specific to the service
WORKDIR /gateway

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
#RUN npm install --omit=dev
RUN npm ci --omit=dev

# Copy application files
COPY . .

ENV NODE_ENV=production

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

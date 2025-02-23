# Use an official Node.js image
FROM node:18-slim

# Set working directory specific to the service
WORKDIR /billing-service

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
#RUN npm install --omit=dev
RUN npm ci --omit=dev

COPY .env .env

ENV NODE_ENV=production

# Copy application files
COPY . .

# pull migrate and generate the  prisma service
#CMD ["npm", "generate:all"]
#RUN npm run dbpull:all
#RUN npm run migrate:all
#RUN npm run generate:all

# Set environment variables from Docker Compose
#ARG SERVICE_PORT
#ARG USER_PROTO_PORT
#ARG APPOINTMENT_PROTO_PORT

#ENV PORT=$SERVICE_PORT
#ENV USER_PROTO_PORT=$USER_PROTO_PORT
#ENV APPOINTMENT_PROTO_PORT=$APPOINTMENT_PROTO_PORT

# Expose the port for this service
EXPOSE 3002 50051 50052
#EXPOSE 3002 $PORT $USER_PROTO_PORT $APPOINTMENT_PROTO_PORT

# Start the service
#CMD ["npm", "start"]
#CMD ["npm", "run", "dbpull:all"] && \
#    ["npm", "run", "migrate:all"] && \
#    ["npm", "run", "generate:all"] && \
#    ["npm", "start"]

CMD ["sh", "-c", "sleep 10 && npm run dbpull:all && npm run migrate:all && npm run generate:all && npm start"]


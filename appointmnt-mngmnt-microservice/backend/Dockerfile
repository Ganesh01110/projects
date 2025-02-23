# Use an official Node.js image
FROM node:18

# Set working directory
WORKDIR /BACKEND

# Copy package.json and install top-level dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all app folders
COPY user-service user-service/
COPY billing-service billing-service/
COPY appointment-service appointment-service/
COPY gateway gateway/

# Install dependencies for each app
RUN cd user-service && npm install && cd ..
RUN cd billing-service && npm install && cd ..
RUN cd appointment-service && npm install && cd ..
RUN cd gateway && npm install && cd ..

# Expose ports for each app (change based on your apps)
EXPOSE 3000 3001 3002 3003 3004

# Start all apps concurrently
CMD ["npm", "start"]
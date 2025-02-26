# Step 1: Build Stage
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the app and build
COPY . .
RUN npm run build

# Step 2: Serve with NGINX
FROM nginx:latest AS serve

# Copy built files to NGINX public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

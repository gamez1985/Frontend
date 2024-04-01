# Stage 1: Build the Angular app
FROM node:20 as builder

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code to the working directory
COPY . .

# Build the Angular app for production
RUN npm run build --c=production

# Stage 2: Serve the Angular app using NGINX
FROM nginx:alpine

# Copy the built Angular app from the previous stage to the NGINX html directory
COPY --from=builder /app/dist/* /usr/share/nginx/html/

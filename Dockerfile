# Use official Node.js image as build environment
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY vite.config.* ./
COPY . .

RUN npm install
RUN npm run build

# Use nginx to serve static files
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
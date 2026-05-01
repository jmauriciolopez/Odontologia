# Multi-stage Dockerfile for Vite Web App
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy app and package files
COPY apps/web/package*.json ./apps/web/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Install dependencies
RUN npm install

# Copy source code
COPY packages/shared-types ./packages/shared-types
COPY apps/web ./apps/web

# Build
RUN npm run build -w packages/shared-types
RUN npm run build -w apps/web

# Production stage with Nginx
FROM nginx:alpine

# Copy built assets from builder
# Vite usually builds to apps/web/dist
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

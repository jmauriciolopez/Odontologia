# Multi-stage Dockerfile for NestJS API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root workspace files
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy app and package files
COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Install dependencies for all workspaces
RUN npm install

# Copy source code
COPY packages/shared-types ./packages/shared-types
COPY apps/api ./apps/api

# Build shared packages first, then the app
RUN npm run build -w packages/shared-types
RUN npm run build -w apps/api

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Install only production dependencies
RUN npm install --omit=dev

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
# If NestJS build goes to apps/api/dist, copy that specifically
# Based on apps/api/package.json start script: node ../../dist/apps/api/main
COPY --from=builder /app/apps/api/dist ./apps/api/dist

EXPOSE 3000

CMD ["node", "dist/apps/api/main"]

# Minimal image for AI server on Cloud Run
FROM node:20-alpine AS base
WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy server code only (frontend is hosted separately)
COPY server ./server

ENV NODE_ENV=production

# Cloud Run provides PORT env var
# EXPOSE is optional and ignored by Cloud Run
# EXPOSE 8000

CMD ["node", "server/index.js"]

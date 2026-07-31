FROM node:18-alpine
WORKDIR /app

# Install dependencies (copy package files first for caching)
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "webhook.js"]

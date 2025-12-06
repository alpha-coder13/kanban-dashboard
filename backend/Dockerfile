# Use Node 20 (Debian based)
FROM node:20

# Install system dependencies if required for sqlite3 native rebuilds
# python3, make, g++ are often included or needed for node-gyp
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

WORKDIR /app
COPY api-server ./api-server
COPY db-server ./db-server


# Install dependencies
WORKDIR /app/api-server
RUN npm install

WORKDIR /app/db-server
RUN npm install

# Copy source code

# Build DB Server (TypeScript)
WORKDIR /app/db-server
RUN npm run build

# Setup entrypoint
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Expose ports
# 3000 is the default API port
EXPOSE 3000

# Entrypoint
CMD ["./start.sh"]
#!/bin/bash

# Default values if not provided from environment
export PORT=${PORT:-3000}
export DATABASE_SERVER_PORT=${DATABASE_SERVER_PORT:-80}
export DATABASE_SERVER_ENDPOINT=${DATABASE_SERVER_ENDPOINT:-localhost}

echo "Starting Application..."
echo "API Server Port: $PORT"
echo "DB Server Port: $DATABASE_SERVER_PORT"

# Start DB Server in the background
echo "Starting DB Server..."
cd /app/db-server
cd dist
mkdir db
# Using node directly on built files is cleaner for production than npm start if it just runs node
node index.js &
DB_PID=$!

# Wait a moment for DB to initialize (optional but safer)
sleep 2

# Start API Server in the foreground
echo "Starting API Server..."
cd /app/api-server
# Pass env vars explicitly if needed, but they are exported above
node index.js

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?

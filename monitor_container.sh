#!/bin/bash

CONTAINER_NAME=$1
MAX_RETRIES=5
RETRY_DELAY=10

# Step 1: Check if the Docker container is running
isRunning=$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME")
if [ "$isRunning" = "true" ]; then
    echo "Container $CONTAINER_NAME is running."
else
    echo "Error: Container $CONTAINER_NAME is not running."
    exit 1
fi

# Step 2: Retry checking if the container is healthy
for ((i=1;i<=MAX_RETRIES;i++)); do
    healthStatus=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME")
    
    if [ "$healthStatus" = "healthy" ]; then
        echo "Container $CONTAINER_NAME is healthy."
        break
    elif [ "$i" -eq "$MAX_RETRIES" ]; then
        echo "Error: Container $CONTAINER_NAME is not healthy after $MAX_RETRIES attempts. Status: $healthStatus"
        exit 1
    else
        echo "Container $CONTAINER_NAME is still starting. Retrying in $RETRY_DELAY seconds... ($i/$MAX_RETRIES)"
        sleep $RETRY_DELAY
    fi
done
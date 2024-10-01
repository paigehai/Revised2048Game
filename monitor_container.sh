#!/bin/bash

CONTAINER_NAME=$1

# Step 1: Check if the Docker container is running
isRunning=$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME")
if [ "$isRunning" = "true" ]; then
    echo "Container $CONTAINER_NAME is running."
else
    echo "Error: Container $CONTAINER_NAME is not running."
    exit 1
fi

# Step 2: Check if the container is healthy
healthStatus=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME")
if [ "$healthStatus" = "healthy" ]; then
    echo "Container $CONTAINER_NAME is healthy."
else
    echo "Error: Container $CONTAINER_NAME is not healthy. Status: $healthStatus"
    exit 1
fi

# Step 3: Perform a health check by querying the Nginx server
responseCode=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:80)
if [ "$responseCode" = "200" ]; then
    echo "Nginx is serving content properly. HTTP 200 received."
else
    echo "Error: Nginx is not serving content properly. HTTP response: $responseCode"
    exit 1
fi

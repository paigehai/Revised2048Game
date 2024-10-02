# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the src directory contents into the container at /usr/share/nginx/html/src
COPY src /usr/share/nginx/html/src

# Expose port 80
EXPOSE 80

# Add a health check that sends a request to the Nginx server
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl -f http://localhost/ || exit 1

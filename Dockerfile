# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy your custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the src directory contents into the container at /usr/share/nginx/html/src
COPY src /usr/share/nginx/html/src

# Expose port 80
EXPOSE 80
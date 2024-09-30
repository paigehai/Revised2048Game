# Use an official Nginx image as a parent image
FROM nginx:latest

# Copy the current directory contents into the container at /usr/share/nginx/html
COPY ./index.html /usr/share/nginx/html/index.html

# Expose port 80 to the world outside this container
EXPOSE 80
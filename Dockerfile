# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy the current directory contents into the container at /usr/share/nginx/html
COPY . /usr/share/nginx/html

# Expose port 3000 to the world outside this container
EXPOSE 3000
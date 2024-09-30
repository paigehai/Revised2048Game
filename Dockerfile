# Use an official Nginx image as a parent image
FROM node:alpine

WORKDIR /usr/src/app
# Copy the current directory contents into the container at /usr/share/nginx/html
COPY ./package*.json .

RUN npm install --production

COPY ./ ./

# Expose port 80 to the world outside this container
EXPOSE 80

USER node

CMD ["npm", "start"]
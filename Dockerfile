# Use an official Nginx image as a parent image
FROM node:alpine

WORKDIR usr/app
# Copy the current directory contents into the container at /usr/share/nginx/html
COPY ./package*.json .

RUN npm install --production

COPY ./ ./

RUN npm run build

# Expose port 80 to the world outside this container
EXPOSE 80

USER node

CMD ["npm", "start"]
# Use Node.js image to install dependencies
FROM node:12.18.2 as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# No build step, so we skip npm run build

# Use nginx to serve the app
FROM nginx
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the application files to NGINX's default HTML directory
COPY --from=build /app /usr/share/nginx/html

# Use the official Node.js image.
# https://hub.docker.com/_/node
FROM node:20.14-alpine  

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies using the package.json and package-lock.json files.
COPY package*.json ./

RUN npm install

RUN npm install -g nodemon

# Copy the local code to the container.
COPY . .

# Set the environment variables.
ENV PORT 3001

# Make port 3000 available to the world outside this container.
EXPOSE 3001

# Run the web service on container startup.
CMD [ "nodemon","-L", "server.js" ]

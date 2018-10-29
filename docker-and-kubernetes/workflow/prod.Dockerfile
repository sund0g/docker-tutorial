# Using AS command to create multi-stage build.
# 
# The sole purpose for the "builder" stage is to install dependencies
# and build the application

FROM node:alpine as builder 

WORKDIR /app

COPY frontend/package.json .

RUN npm install

COPY frontend/. .

# Using RUN instead of CMD for this stage because it is building assets;
# it doesn't create a container that will be started and ran.

RUN npm run build

# NOTE: The output of the previous RUN command will be the "build" folder.
# This folder will be created in the working directory, i.e. "/app/build"
# It contains all the production assets that will be served to the world.

# Each new FROM section terminates the previous section.

# This stage is where we build the nginx container that will run in production.

FROM nginx

# Copy the build folder from the "builder" stage above using "--from=stage".
# We get the nginx target folder from the instructions at
# https://store.docker.com/images/nginx in the "Hosting some simple static 
# content" section.

COPY --from=builder /app/build /usr/share/nginx/html

# We don't have to secify a CMD section here because the default command
# from the nginx container is to start the server.

FROM node:alpine as builder 

WORKDIR '/app'

COPY ./package.json .

RUN npm install

COPY . .

# This step is the build process for the production assets.
RUN npm run build

FROM nginx

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
FROM node:lts-alpine as build

WORKDIR /

# Installing `node_modules` only if package.json has changed
COPY ./package.json ./package-lock.json .
RUN npm ci

# Copy the rest and build the thing
COPY . .
RUN npm run build

FROM nginx:latest as site
COPY --from=build /public /var/www/html
ADD /nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp
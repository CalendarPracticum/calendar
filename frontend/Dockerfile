# build env
FROM node:18.16.0-alpine as build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm i
COPY . .
RUN npm run build
CMD cp -r build result_build

FROM node:18.1.0-alpine3.14
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

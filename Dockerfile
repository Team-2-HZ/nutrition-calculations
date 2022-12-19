FROM node:19.1.0
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .

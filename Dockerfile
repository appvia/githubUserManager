FROM node:17.7.1-alpine@sha256:82c0402acb72a3c8f02a4ae43543f710d9868d5980de7c273646c9d9b4cd74f7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
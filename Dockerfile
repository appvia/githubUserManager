FROM node:18.7.0-alpine@sha256:02a5466bd5abde6cde29c16d83e2f5a10eec11c8dcefa667a2c9f88a7fa8b0b3

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
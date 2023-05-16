FROM node:20.2.0-alpine@sha256:4559bc033338938e54d0a3c2f0d7c3ad7d1d13c28c4c405b85c6b3a26f4ce5f7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
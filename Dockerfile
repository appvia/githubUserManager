FROM node:18.4.0-alpine@sha256:7ae41699c38d8e50f5bf592867cf661368d71ff922e07f6f66f36dca2ff0c590

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
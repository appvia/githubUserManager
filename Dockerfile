FROM node:17.8.0-alpine@sha256:0c88ddeb949638cbaa8438a95aff1fce0e7c83e09c6f154245a1a8b0a1becd9e

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
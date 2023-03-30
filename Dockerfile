FROM node:19.8.1-alpine@sha256:fcf4e6f4557788bcd3338f717e39dbaa5061bc0154e7d96bda0bca9447ec8056

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
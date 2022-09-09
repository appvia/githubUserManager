FROM node:18.9.0-alpine@sha256:0a596bf1cd8a9b8b594a1ebd667f45abb929b5d003c2c6d5bad778a79214e7a7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
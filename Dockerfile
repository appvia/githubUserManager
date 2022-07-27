FROM node:18.7.0-alpine@sha256:b718f847a580064e7ad90103f99509a31a0ca092e6807a84011f28c5a020f80b

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:18.11.0-alpine@sha256:aef44fc3a776dbf62bfcd0f49aaec7114ea1b9a1d775f3db57e19a037ed4d1c8

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
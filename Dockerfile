FROM node:17.7.1-alpine@sha256:1cc03b302881bab0afe450fd51138718c81156d107427dbebb3c2301819620a7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
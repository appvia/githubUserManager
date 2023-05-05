FROM node:20.1.0-alpine@sha256:6e56967f8a4032f084856bad4185088711d25b2c2c705af84f57a522c84d123b

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
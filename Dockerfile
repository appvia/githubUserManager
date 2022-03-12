FROM node:17.7.1-alpine@sha256:8c62619815dd2d7642f9e9c7f30d7016249a41175dfca0aaf248171960e4cc80

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
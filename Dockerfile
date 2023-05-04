FROM node:20.1.0-alpine@sha256:62b68c3611b161990bab4c4356c7bf8f0217f04d0d75f1f6ae659683ba0434d4

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
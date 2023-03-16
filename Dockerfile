FROM node:19.8.1-alpine@sha256:e1ae0f5ddec532777e441cea8d51a54741cbaa5de6681c70f53ae587fa6ccd0a

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
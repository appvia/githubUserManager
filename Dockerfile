FROM node:18.6.0-alpine@sha256:cd8f5b451e927f3c5c92016cfaf9d6805999faeded64486d8f76c9d4ef6f1b5c

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:18.0.0-alpine@sha256:da3ba92e263a2e07b8a6adeccf9650d93cafc5cd96a37106d880eaabd2dc804b

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
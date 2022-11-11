FROM node:19.0.1-alpine@sha256:e0458867140b9770f7ac1576126c63f06ae9a581288f924c82aa5bd715a0bdd1

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
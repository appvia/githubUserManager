FROM node:18.7.0-alpine@sha256:2b9cec12c8863878b6cbe7901d7ef21e264def99a63064a70e2a38a65c408f01

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:17.8.0-alpine@sha256:29b18ec3a6e20178c4284e57649aa543a35bcd27d674600f90e9dc974130393c

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
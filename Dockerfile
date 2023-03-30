FROM node:19.8.1-alpine@sha256:ce9dd01fefe302dce994c07fb32b55403a79acd693c9d841571dc14fc47826c8

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
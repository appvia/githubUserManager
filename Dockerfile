FROM node:19.0.1-alpine@sha256:083a23fe246cc82294f64e154f5d6bce8c90b9fc8f2dce54d3c58d41ddd8f8c8

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
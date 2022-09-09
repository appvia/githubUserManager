FROM node:18.9.0-alpine@sha256:9d18714188f962781e7e7e131d4dfdcc8f11d7724b67ace46eb6ef3e311a6d85

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
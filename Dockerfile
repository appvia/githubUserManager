FROM node:18.7.0-alpine@sha256:7d563fd33907c471a57012c722a1cf7ca76a928c2d2145ab114351ba4313b3f8

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
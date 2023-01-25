FROM node:19.5.0-alpine@sha256:cdf19f4bb748ce4520ea693d3c5d9b24d73fc6bdebced57dad2046615c142ba1

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
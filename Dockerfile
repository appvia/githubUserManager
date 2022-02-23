FROM node:17.6.0-alpine@sha256:80fff7fcd66e3038eadd36a5eac6897abbc5054fa4f71681ba9944145d1faa5e

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:18.3.0-alpine@sha256:57b98f182ea7253f213f742f1f7bac3f881adc5e40d72f5eafbf2e70bf6f6647

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
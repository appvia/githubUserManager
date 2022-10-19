FROM node:19.0.0-alpine@sha256:88f6aa846169ea75341059f3104d6c5ebeac4be861a5adcf0489fccb55573ea7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
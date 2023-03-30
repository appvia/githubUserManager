FROM node:19.8.1-alpine@sha256:d44f0dd7cfed9038edc5760d465f25c3079a995f36770ff745734637dda8eb9d

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
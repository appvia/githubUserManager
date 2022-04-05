FROM node:17.8.0-alpine@sha256:57106b8c14fdfc6d1ee2b27de320a4d17db55032c4e6e99ff1021d81ef01c328

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
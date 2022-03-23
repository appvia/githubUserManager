FROM node:17.8.0-alpine@sha256:c6fa8b1ea6d027c8fcbe33dee878e5b01c172ea65f3c1aed308008ebbc9db0b2

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
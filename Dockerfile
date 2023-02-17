FROM node:19.6.1-alpine@sha256:8aa6a78d01e6bf5dd2474d7fe2786948e6adc815149662c3e1db90270387af1c

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:19.0.1-alpine@sha256:621d8236942be3a9dc091b339990a2bafcc1b2a8f64af0fa3a2a59d03092f003

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
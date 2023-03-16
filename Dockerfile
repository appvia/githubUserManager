FROM node:19.8.1-alpine@sha256:a9ae4e48d5c6b9fbce05eb4494e3a4dc4d184347d0d9ee24a52fdd5ac35e5a75

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
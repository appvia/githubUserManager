FROM node:19.0.0-alpine@sha256:f8d30057a1bdc98e69483ae0eee11ce6507c93e3b7736e71f0e43b9622865f18

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
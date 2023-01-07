FROM node:19.4.0-alpine@sha256:88e1842dc5fa44e40aea2d097685612c15c5f32b18d8b55766355de53dd5d5a7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
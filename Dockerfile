FROM node:19.0.1-alpine@sha256:00c5c0850a48bbbf0136f1c886bad52784f9816a8d314a99307d734598359ed4

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
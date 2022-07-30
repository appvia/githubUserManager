FROM node:18.7.0-alpine@sha256:4c8f734f33b4c8bb41c3caf17c61e6828e45cdc39dcc3fd495d0fb3213b33cfe

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
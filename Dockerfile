FROM node:19.2.0-alpine@sha256:396a6dc35eb37c50bf484f484e0b0d9e2ab6b6ba9e3f6858d3380db67c233c70

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
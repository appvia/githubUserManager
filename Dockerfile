FROM node:18.9.1-alpine@sha256:566ffe130bb0fd2d03d492333ad2e9c35fcf1f2c9d8be6311b3c29d6c138802a

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
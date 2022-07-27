FROM node:18.7.0-alpine@sha256:4b16711d381fa74c8e4256230aba22720c7774678f5d83c0430f10ea317f37de

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
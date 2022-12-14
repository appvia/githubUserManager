FROM node:19.3.0-alpine@sha256:7fd9adefcef2f5161e1923dee30b8b392a4f71bad2fd3371e9229f2fc6669d0a

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
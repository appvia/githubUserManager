FROM node:17.8.0-alpine@sha256:0f923922724e7d04a699ceb7b92b8383ec093b4e249804c8bd94886426443bff

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
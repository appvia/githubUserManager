FROM node:17.8.0-alpine@sha256:5ab369918ba60758dcdce5376befaf4ab23d602d2a35b9bfe225b4af273b4df5

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
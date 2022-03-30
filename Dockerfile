FROM node:17.8.0-alpine@sha256:787f03b9c8fa9942e98707053b02ea5e390d770a47ec0959a45adb0e277454fb

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
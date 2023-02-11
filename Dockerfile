FROM node:19.6.0-alpine@sha256:103506464ad0c73abd7f80f6ce547545ef2d523fdab318eacc4d0fa44bae9b8f

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:19.2.0-alpine@sha256:10becb3df627d675cf07fb1b48d854b18e6d58194f00647c2b8aaac7fb829b60

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
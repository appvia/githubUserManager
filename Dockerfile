FROM node:18.3.0-alpine@sha256:54f0280725f18e204fb7380f9a1f21213da5c044acc5dddf6a2c02c424958012

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:19.0.1-alpine@sha256:c52e5b3c03f00fcff858ee07914ea36b780bd4de07f2c97553f8fed46a602832

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
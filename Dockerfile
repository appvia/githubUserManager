FROM node:19.1.0-alpine@sha256:27b073eb613d3700018c8d457b99a0ccaad1241ee0a22f7fc64fd0ab4f9de201

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
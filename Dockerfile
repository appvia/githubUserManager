FROM node:19.0.1-alpine@sha256:d7ec45ceb1c71c376ae2762abd8c0cb0cd29bb6abdb537950529f5f3aee2f78c

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
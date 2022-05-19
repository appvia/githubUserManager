FROM node:18.2.0-alpine@sha256:000f83db8cbd0c526599617c3b79a7a839ff7cd1c151d993e25a5bb382b91b23

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
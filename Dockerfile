FROM node:19.0.1-alpine@sha256:389b6e6e2d9ab5fc0e7cad3e24ac8ac8753b3437d96ea7eaf3306e0be506abf5

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:18.5.0-alpine@sha256:0e0757af2da5f7d4af25ae1c50665207a8821894b9863f11a6d755690ac5a5c7

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
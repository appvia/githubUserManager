FROM node:18.9.1-alpine@sha256:e64afda0cb402531bed1eca292de4e343f1784a6da76615dff99006d5ddc8a90

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
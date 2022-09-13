FROM node:18.9.0-alpine@sha256:370c4e3b4da19d62f0afc7e6c5f78e3d28d861680c324144a56141fd43c1498c

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
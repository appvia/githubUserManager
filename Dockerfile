FROM node:17.8.0-alpine@sha256:573a21cc05c2825d068eacacd444fdd046dce3cf1486faf6d65bcf031624f115

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
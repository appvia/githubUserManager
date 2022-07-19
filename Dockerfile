FROM node:18.6.0-alpine@sha256:39e0181574d677b5a501631cf816b2ae311dfaedd54b227e0f8454a81b139359

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:20.0.0-alpine@sha256:23fccb498982d16219723fbc4364065eb6162f9b61df4f65f6f02c800b84f7bc

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
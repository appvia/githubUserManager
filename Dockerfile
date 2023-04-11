FROM node:19.9.0-alpine@sha256:d8c4561cd134ebd0e66c33f3eb4860c7bc35a71c0c5dc2cc6904c3d63a3522ca

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
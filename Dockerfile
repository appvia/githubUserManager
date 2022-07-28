FROM node:18.7.0-alpine@sha256:af502799866e8044883622a66828a2536447123d9dd415f9f09e8259bc4c52ee

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
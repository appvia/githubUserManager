FROM node:18.6.0-alpine@sha256:9e148d7ea51eafc6b00cfc6a398bd80559e295c1613ed94c1bde567eca0c528d

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
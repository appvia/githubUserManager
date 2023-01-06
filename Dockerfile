FROM node:19.4.0-alpine@sha256:1c7f2bc2102e4a12279af1f6e67c66c50b4d78f31116172bb48ee6f6356d9878

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
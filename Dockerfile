FROM node:17.8.0-alpine@sha256:61437e1e517019bd27eb4d3ff6a055096e4a8c048230c2d55ef50d6e970ec608

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
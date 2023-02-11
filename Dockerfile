FROM node:19.6.0-alpine@sha256:992dd138340c189b2bc49d879cc4b328b12b8aa3480a43b1a05505a18987df3b

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
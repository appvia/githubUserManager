FROM node:18.10.0-alpine@sha256:fd5f5b9507f909dee4ba9c5ec554cae3f8d3761fa82f6226df1a269512c6b8eb

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
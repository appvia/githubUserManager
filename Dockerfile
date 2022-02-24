FROM node:17.6.0-alpine@sha256:250e9a093b861c330be2f4d1d224712d4e49290eeffc287ad190b120c1fe9d9f

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
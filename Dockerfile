FROM node:18.1.0-alpine@sha256:95d4139368f3fad19130dd59a2870e451d43aa06167f3873414ef518a94d399f

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
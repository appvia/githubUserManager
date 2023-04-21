FROM node:20.0.0-alpine@sha256:cc4e8f3d78a276fa05eae1803b6f8cbb43145441f54c828ab14e0c19dd95c6fd

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
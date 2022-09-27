FROM node:18.9.1-alpine@sha256:3f2d9530d21df22bdd283203639d59e855aafa424acf72c5875e20a305d4e850

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
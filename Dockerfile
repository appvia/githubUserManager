FROM node:19.8.1-alpine@sha256:c662fff376391d71a9fdf02fdc4da5b9f494f9d0ff7835dc53d05c956f29e75f

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
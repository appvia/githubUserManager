FROM node:18.4.0-alpine@sha256:5c55d910deeefeacf090a64837201ad9553d66e56173d91249b60c3118a128b4

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:19.0.1-alpine@sha256:932ac21d843f81a4f0ced4681b70b345e20f8addcc15d55c8d8d965ef99d20b6

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
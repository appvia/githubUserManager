FROM node:19.0.0-alpine@sha256:bdd47da7e6d246549db69891f5865d82dfc9961eae897197d85a030f254980b1

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
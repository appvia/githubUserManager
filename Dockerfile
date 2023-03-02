FROM node:19.7.0-alpine@sha256:155e324802ebfdd3f508340dcb0cd4a7510f8594802a2e53150f171ae8aa2462

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
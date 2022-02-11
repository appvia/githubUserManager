FROM node:17.5.0-alpine@sha256:570ce8a18bedac3f7263dc1563331681d6eaad72ce133b995b9be38c04db3627

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
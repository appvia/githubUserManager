FROM node:17.8.0-alpine@sha256:63f67b0490c7f3cc5363209a6df696d93675bed5e8573481b3d576e1262dbb8d

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
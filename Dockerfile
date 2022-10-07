FROM node:18.10.0-alpine@sha256:24f5462c275694fd09a134300a66f64c42898b05c0fdd223581504bfc05d48bb

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
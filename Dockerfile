FROM node:19.0.0-alpine@sha256:5a7b6772549bfbb856769f9e3d090812450399a746654a8b89a80b2026591902

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
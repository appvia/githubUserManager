FROM node:19.7.0-alpine@sha256:dd693a7fc06b8ae60c30ff8d693ef44ae9fb048b36c82b0770efdff15af99b4d

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
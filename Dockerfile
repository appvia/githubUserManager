FROM node:17.6.0-alpine@sha256:4cd7597eff69e9e4603f926e21a2cfa9dff8c49fca72914a4e6428ebf9bc91d6

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
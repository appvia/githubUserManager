FROM node:17.8.0-alpine@sha256:3981a6d3b7aa40192f7030f344f4e6f7ea6e932ab948e417407d6af2ca007226

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
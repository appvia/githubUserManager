FROM node:19.6.1-alpine@sha256:78fa26eb2b8081e9005253e816ed75eaf6f828feeca1e1956f476356f050d816

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:20.0.0-alpine@sha256:1d34273b1b489a4e879ccfaee83c1cec99acbb5a4128f880981071e1bae62b97

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
FROM node:17.7.2-alpine@sha256:5633692092c7572c7484aadaf49e02a572ded946f782374063724860456012ff

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
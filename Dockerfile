FROM node:18.10.0-alpine@sha256:f829c27f4f7059609e650023586726a126db25aded0c401e836cb81ab63475ff

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
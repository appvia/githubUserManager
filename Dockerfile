FROM node:18.11.0-alpine@sha256:c068007678f3cd95ffe29fd28a6053167975068e056a7906d7cf0ad412dbca3a

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
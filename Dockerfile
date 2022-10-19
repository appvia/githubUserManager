FROM node:19.0.0-alpine@sha256:48e43334c84762aa05c18dac37ec5ca396e9d55c5cb053f15cd4edbfe89a0914

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

CMD cd /app && npm start 
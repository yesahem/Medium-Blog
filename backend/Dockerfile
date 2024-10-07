FROM node:20-alpine

RUN apk add --no-cache \
    ca-certificates \
    libc-dev

WORKDIR /app/backend

COPY package*.json .

COPY prisma ./prisma

RUN npm install

COPY . .

ENV WRANGLER_SEND_METRICS=false

CMD [ "npm", "run", "dev:docker" ]

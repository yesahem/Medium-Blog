FROM node:22

RUN apt-get -qq update && \
    apt-get install -qqy --no-install-recommends \
        ca-certificates \
        libc++-dev &&  \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

COPY package*.json .

COPY prisma ./prisma

RUN npm install

COPY . .

ENV WRANGLER_SEND_METRICS=false

CMD [ "npm", "run", "dev:docker" ]
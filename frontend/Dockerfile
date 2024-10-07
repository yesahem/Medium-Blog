FROM node:22-alpine

WORKDIR /app/frontend

COPY package.json .

RUN npm install

# RUN npm i -g serve

COPY . .

# RUN npm run build

EXPOSE 3000

# CMD [ "serve", "-s", "dist" ]
CMD [ "npm", "run", "dev" ]
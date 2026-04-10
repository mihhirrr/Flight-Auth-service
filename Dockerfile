FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm i

COPY . . 

WORKDIR /app/src

WORKDIR /app

CMD ["sh", "-c", "cd src && npx sequelize db:migrate && cd .. && npm run dev"]

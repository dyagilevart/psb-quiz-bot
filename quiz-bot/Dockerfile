FROM node:latest

WORKDIR /quiz-bot
COPY package.json .
RUN npm install
COPY . .
CMD npm start
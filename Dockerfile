FROM node:20.17.0

COPY package*.json ./
RUN npm install


RUN npm i -g nodemon

RUN mkdir -p /home/app

WORKDIR /home/app

EXPOSE 3000

CMD ["nodemon", "app.js"]

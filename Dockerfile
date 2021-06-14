FROM node:14-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json /usr/src/app/
RUN npm install --only=prod
COPY *.js* /usr/src/app/
EXPOSE 9000
CMD [ "node", "index.js" ]

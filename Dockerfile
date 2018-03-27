FROM node:8
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY *.js* /usr/src/app/
RUN npm install
EXPOSE 9000
CMD [ "node", "index.js" ]


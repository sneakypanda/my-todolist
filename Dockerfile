FROM node:10-alpine

WORKDIR /opt
COPY . .
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]
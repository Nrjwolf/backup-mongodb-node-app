FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN npm install pm2 --location=global
RUN npm install --location=global typescript
RUN yarn
COPY . .

EXPOSE 3000

# Install mongo
RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install gnupg
RUN wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
RUN apt-get update
RUN apt-get install -y mongodb-org
RUN mongo --version

RUN chown -R node /usr/src/app
USER node

RUN tsc
CMD pm2-runtime "dist/app.js"
FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

ENV NODE_ENV=production
RUN yarn --prod
COPY . .

EXPOSE 3000

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get install gnupg

RUN chown -R node /usr/src/app
USER node

# RUN wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
# RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
# RUN sudo apt-get update
# RUN sudo apt-get install -y mongodb-org

CMD ["yarn", "start"]
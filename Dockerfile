FROM node:16

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

ENV NODE_ENV=production
RUN yarn --prod
COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app
USER node

CMD ["yarn", "start"]
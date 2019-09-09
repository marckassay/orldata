FROM orldata_app:latest

WORKDIR /usr/src/app

COPY ./ ./

RUN yarn add

RUN yarn run build:production

ARG ALPINE_VER
# Stage 1 of 2: install dependencies and devDependencies
FROM alpine:${ALPINE_VER} as install

ARG ALPINE_VER

ENV ALPINE_VER $ALPINE_VER

RUN apk add --no-cache \
  bash \
  nodejs \
  yarn

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json yarn* ./

RUN yarn install --ignore-engines && cp -f yarn.lock /tmp

# Start Build (via ng cli)

COPY ./ ./

# docker-compose yml files override the following CMD
CMD exit 1

# Stage 2 of 2: install for development
FROM install

RUN apk add --no-cache \
  git

WORKDIR /usr/src/app

COPY /tmp/yarn.lock ./

CMD ["./"]

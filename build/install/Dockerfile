ARG ALPINE_VER
# Stage 1 of 1: install dependencies and devDependencies
FROM alpine:${ALPINE_VER} as install

ARG ALPINE_VER

ENV ALPINE_VER $ALPINE_VER

RUN echo "Using Alpine version number: ${ALPINE_VER}"

RUN apk add --no-cache \
  bash \
  nodejs \
  yarn

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json yarn.lock? ./

RUN yarn install --ignore-engines

# Start Build (via ng cli)

COPY ./ ./

# docker-compose yml files override the following CMD
CMD yarn -v

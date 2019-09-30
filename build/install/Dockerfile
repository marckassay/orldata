ARG ALPINE_VER

FROM alpine:${ALPINE_VER} as alpine

# Stage 1 of 2: install dependencies and devDependencies
FROM alpine as install

ARG ALPINE_VER
ENV ALPINE_VER $ALPINE_VER
RUN apk add --no-cache \
  bash \
  nodejs \
  yarn

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json *yarn* ./
RUN yarn install --ignore-engines \
  && cp -f yarn.lock /tmp

COPY ./ ./


# Stage 2 of 2: install for development
FROM install as development

WORKDIR /usr/src/app
RUN apk add --no-cache \
  git


# Stage 2 of 2: install for production
FROM install as production-0

WORKDIR /usr/src/app
RUN yarn run build:production


# Stage 2 of 2: install for production
FROM alpine as production-1
COPY --from=production-0 /usr/src/app/dist /usr/src/app/dist


FROM production-1

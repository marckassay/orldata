ARG ALPINE_VER

# Stage 1 of 6: creates an alias named 'alpine'. ALPINE_VER is defined by docker-compose file
FROM alpine:${ALPINE_VER} as alpine


# Stage 2 of 6:  creates an alias 'install' that calls `yarn install`. yarn lock file is moved to mounted volume
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


# Stage 3 of 6: from install image, just adds git to Alpine. `ng serve` is to be during development, not here at build time.
FROM install as development

WORKDIR /usr/src/app
RUN apk add --no-cache \
  git


# Stage 4 of 6: calls `ng build` for production build.
FROM install as production-0

WORKDIR /usr/src/app
RUN yarn run build:production


# Stage 5 of 6: reduces production-0 to just the output directory of `ng build`
FROM alpine as production-1
COPY --from=production-0 /usr/src/app/dist /usr/src/app/dist


# Stage 6 of 6: final image for docker-compose to target.
FROM production-1

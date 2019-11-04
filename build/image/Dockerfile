ARG ALPINE_VER
ARG NGINX_VER

# Stage 1 of 5: creates an alias named 'alpine'. ALPINE_VER is defined by docker-compose file
FROM alpine:${ALPINE_VER} as alpine


# Stage 2 of 5: creates an alias 'install' that calls `yarn install` that installs dependencies and devDependencies. yarn lock file
#               is moved to mounted volume
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


# Stage 3 of 5: derived from install image, just adds the git APK to Alpine. When working with container, `ng serve` is to be used.
FROM install as development

WORKDIR /usr/src/app
RUN apk add --no-cache \
  git


# Stage 4 of 5: calls `ng build` for production build.
FROM install as production

WORKDIR /usr/src/app
RUN yarn run build:production


# Stage 5 of 5: reduces production to just its output directory from running `ng build`. This path is bound to volume mount.
FROM nginx:${NGINX_VER}-alpine as deployment

COPY --from=production /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# TODO:
# Stage 6?: linux, az, pwsh image and pass credentials into it to deploy

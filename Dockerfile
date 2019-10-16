FROM python:3.6-alpine
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>

WORKDIR /code

COPY package.json package-lock.json webpack.common.js webpack.prod.js ./

RUN apk add nodejs-npm && \
    npm install

COPY . .

CMD npm run prod

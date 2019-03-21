FROM python:3.6-alpine
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>

WORKDIR /code
COPY requirements.txt .

RUN apk update && \
    apk add --virtual .build-deps gcc musl-dev && \
    pip install --upgrade pip && \
    pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

COPY package.json package-lock.json webpack.common.js webpack.prod.js ./

RUN apk add nodejs-npm && \
    npm install

COPY . .
COPY bin/startup.sh /bin/startup.sh

EXPOSE 5000

CMD /bin/sh /bin/startup.sh

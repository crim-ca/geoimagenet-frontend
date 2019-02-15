FROM python:3.6-alpine
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>

WORKDIR /code
COPY requirements.txt .
COPY package.json .
COPY package-lock.json .
COPY webpack-common.config.js .
COPY webpack-prod.config.js .
COPY .nvmrc .
COPY . .

RUN apk update && \
    apk add --virtual .build-deps gcc musl-dev && \
    pip install --upgrade pip gunicorn && \
    pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

RUN apk add --virtual .build-deps nodejs-npm && \
    npm install && npm run prod && \
    rm -rf node_modules && \
    apk --purge del .build-deps


EXPOSE 5000

# Start gunicorn
CMD ["gunicorn", "--config", "/code/Framework/gunicorn_config.py", "Framework:fl_app", "-k", "eventlet"]

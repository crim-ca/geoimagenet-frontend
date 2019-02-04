FROM python:3.6-alpine
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>

WORKDIR /code
COPY requirements.txt .

RUN apk update && \
    apk add --virtual .build-deps gcc musl-dev && \
    pip install --upgrade pip gunicorn && \
    pip install -r requirements.txt --no-cache-dir && \
    apk --purge del .build-deps

COPY . .

EXPOSE 5000

# Start gunicorn
CMD ["gunicorn", "--config", "/code/Framework/gunicorn_config.py", "Framework:fl_app", "-k", "eventlet"]

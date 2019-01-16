FROM python:3.6-alpine
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>

RUN apk update && \
    apk add gcc musl-dev && \
    pip install --upgrade pip && \
    pip install gunicorn

WORKDIR /code

ENV DEBIAN_FRONTEND noninteractive

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

# Start gunicorn
CMD ["gunicorn", "--config", "/code/Framework/gunicorn_config.py", "Framework:fl_app", "-k", "eventlet"]

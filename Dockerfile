FROM ubuntu:18.04
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update
RUN apt-get install -y python3 python3-pip python3-setuptools gunicorn
RUN pip3 install --upgrade pip

# Setup flask application
RUN mkdir -p /deploy/GeoImageNet
COPY Framework/gunicorn_config.py /deploy/gunicorn_config.py
COPY Framework /deploy/GeoImageNet/Framework
COPY GIN /deploy/GeoImageNet/GIN
COPY templates /deploy/GeoImageNet/templates
COPY locales /deploy/GeoImageNet/locales
COPY static /deploy/GeoImageNet/static
COPY requirements.txt /deploy/GeoImageNet
RUN pip3 install -r /deploy/GeoImageNet/requirements.txt
WORKDIR /deploy/GeoImageNet

EXPOSE 5000

# Start gunicorn
CMD ["gunicorn", "--config", "/deploy/gunicorn_config.py", "Framework:app", "-k", "eventlet"]

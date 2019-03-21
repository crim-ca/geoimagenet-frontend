#!/usr/bin/env bash

export NODE_ENV=production
npm run prod
gunicorn --config /code/Framework/gunicorn_config.py Framework:fl_app -k eventlet

#!/usr/bin/env bash

export NODE_ENV=production
npm run prod
gunicorn --config /code/GIN/gunicorn_config.py GIN:app -k eventlet

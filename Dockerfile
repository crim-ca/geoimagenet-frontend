FROM node:11.9-alpine
MAINTAINER Félix Gagnon-Grenier <felix.gagnon-grenier@crim.ca>
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD npm run prod

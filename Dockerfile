# docker build -t meanjs/mean .
#
# Run:
# docker run -it meanjs/mean
#
# Compose:
# docker-compose up -d

FROM ubuntu:latest
MAINTAINER MEAN.JS

# Install Utilities
RUN apt-get update -q
RUN apt-get install -yqq wget aptitude htop vim git traceroute dnsutils curl ssh sudo tree tcpdump nano psmisc gcc make build-essential libfreetype6 libfontconfig libkrb5-dev python2.7 collectd

ENV PYTHON /usr/bin/python2.7

# Install gem sass for grunt-contrib-sass
RUN apt-get install -y ruby
RUN gem install sass

# Install NodeJS
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs

# Install MEAN.JS Prerequisites
RUN npm install --quiet -g grunt-cli gulp bower mocha karma-cli pm2 forever collectd

RUN mkdir /opt/mean.js
RUN mkdir -p /opt/mean.js/public/lib
WORKDIR /opt/mean.js

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
ADD package.json /opt/mean.js/package.json
RUN npm install --quiet

# Install bower packages
ADD bower.json /opt/mean.js/bower.json
ADD .bowerrc /opt/mean.js/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

# Share local directory on the docker container
ADD . /opt/mean.js

# Machine cleanup
RUN npm cache clean
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set development environment as default
ENV NODE_ENV development

# Ports generic
EXPOSE 80:80
EXPOSE 443:443

# Port 3000 for MEAN.JS server
EXPOSE 3000:3000

# Port 5858 for node debug
EXPOSE 5858:5858

# Port 35729 for livereload
EXPOSE 35729:35729

# Run MEAN.JS server
COPY collectd.conf /etc/collectd/


COPY docker-entrypoint.sh /entrypoint.sh

#RUN chown -R node:node /entrypoint.sh

RUN chmod +x  /entrypoint.sh

#USER node

ENTRYPOINT ["/entrypoint.sh"]

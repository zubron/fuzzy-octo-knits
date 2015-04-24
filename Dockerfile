FROM	ubuntu:latest

RUN	apt-get update
RUN	apt-get install -y git vim curl nodejs nodejs-dev npm
RUN	ln -s /usr/bin/nodejs /usr/bin/node

RUN	mkdir /apps
ADD	. /apps/chart

WORKDIR	/apps/chart

EXPOSE	8080
RUN npm install
CMD	["npm", "start"]

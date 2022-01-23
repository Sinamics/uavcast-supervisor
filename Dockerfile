# This stage installs our modules
FROM arm32v7/node:buster-slim
WORKDIR /app

RUN useradd -ms /bin/bash uavcast
RUN usermod -aG sudo uavcast
RUN echo "uavcast:uavcast" | chpasswd

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python3
RUN apt-get update && apt-get install -y curl sudo
#install docker
RUN apt-get -y install apt-transport-https \
       ca-certificates \
       curl \
       gnupg2 \
       software-properties-common && \
       curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && \
       add-apt-repository \
       "deb [arch=armhf] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
       $(lsb_release -cs) \
       stable" && \
       apt-get update && \
       apt-get -y install docker-ce

RUN touch /var/run/docker.sock
RUN chmod 777 /var/run/docker.sock

#changes the ownership of /var/run/docker.sock
RUN chown root:docker /var/run/docker.sock
# RUN chown -R uavcast /app/uavcast

RUN newgrp docker

COPY package.json package-lock.json ./
RUN npm install

# # Then we copy over the modules from above onto a `slim` image
# FROM mhart/alpine-node:slim-12

# # If possible, run your container using `docker run --init`
# # Otherwise, you can use `tini`:
# # RUN apk add --no-cache tini
# # ENTRYPOINT ["/sbin/tini", "--"]

WORKDIR /app

COPY . .
CMD ["node", "src/index.js"]

#build 
#docker build -t sinamics/uavcast-supervisor:1.0.1 .

#docker push sinamics/uavcast-supervisor:1.0.1

#run
#docker run --name supervisor --net=host -d -v /var/run/docker.sock:/var/run/docker.sock sinamics/uavcast-supervisor
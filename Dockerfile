FROM --platform=$TARGETPLATFORM node:14.18.3-bullseye-slim
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETARCH

WORKDIR /app

RUN useradd -ms /bin/bash uavcast
RUN usermod -aG sudo uavcast
RUN echo "uavcast:uavcast" | chpasswd

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python3
RUN apt-get update && apt-get install -y curl sudo
#install docker
RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN DRY_RUN=1 sh ./get-docker.sh

RUN touch /var/run/docker.sock
RUN chmod 777 /var/run/docker.sock

#changes the ownership of /var/run/docker.sock
RUN groupadd docker
RUN chown uavcast:docker /var/run/docker.sock
# RUN chown -R uavcast /app/uavcast

RUN newgrp docker
COPY . .

RUN npm install

# ENTRYPOINT ["tail", "-f", "/dev/null"]
CMD ["node", "src/index.js"]

#build 
#docker build -t sinamics/uavcast-supervisor:1.0.1 .

#docker push sinamics/uavcast-supervisor:1.0.1

#run
#docker run --name supervisor --net=host -d -v /var/run/docker.sock:/var/run/docker.sock sinamics/uavcast-supervisor:1.0.1
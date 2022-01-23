#!/bin/bash
if [[ $1 == '' ]]; then
    echo "version is missing"
    echo "example:: ./compile_push.sh 1.0.0"
    exit
fi

docker buildx create --name uavcast_builder
docker buildx use uavcast_builder
docker run --privileged --rm tonistiigi/binfmt --install all

docker buildx build --pull --rm -f "Dockerfile" \
--platform linux/arm,linux/arm64,linux/amd64 \
-t sinamics/uavcast-supervisor:$1 "." --push

# docker build -t sinamics/uavcast-supervisor:$1 .
# docker push sinamics/uavcast-supervisor:$1
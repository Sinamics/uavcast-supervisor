#!/bin/bash
if [[ $1 == '' ]]; then
    echo "version is missing"
    echo "example:: ./compile_push.sh 1.0.0"
    exit
fi

docker build -t sinamics/uavcast-supervisor:$1 .
docker push sinamics/uavcast-supervisor:$1
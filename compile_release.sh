#!/usr/bin/env bash

progname=$(basename $0)
docker_local=0
docker_publish=0
version_arg=1.0.1
image_name=sinamics/uavcast-supervisor
# usage function
function usage()
{
   cat << HEREDOC
   Usage: $progname [ --image_name NAME ] [ --version VERSION ] [ --docker_publish ] [ --docker_local ]
   Example publish:
    ./compile_release.sh --image_name sinamics/uavcast-supervisor --version 1.0.1 --docker_publish
   Example local build:
    ./compile_release.sh --image_name sinamics/uavcast-supervisor --version 1.0.1 --docker_local
   optional arguments:
     -h, --help                 Show help
     -n, --image_name           Docker image name (repo/name)
     -v, --version              Set app version (repo/name:[version])
     -d, --docker_local         Build docker image locally
     -p, --docker_publish       Publish docker image to dockerhub
HEREDOC
}

OPTS=$(getopt -o "hpdv:n:" --long "help,docker_local,docker_publish,version:,image_name:" -n "$progname" -- "$@")
if [ $? != 0 ] ; then echo "Error in command line arguments." >&2 ; usage; exit 1 ; fi
if [ $# == 0 ] ; then usage; exit 1 ; fi

eval set -- "$OPTS"
while true; do
  # uncomment the next line to see how shift is working
#   echo "\$1:\"$1\" \$2:\"$2\""
  case "$1" in
    -h | --help ) usage; exit; ;;
    -n | --image_name ) image_name="$2"; shift 2 ;;
    -v | --version ) version_arg="$2"; shift 2 ;;
    -d | --docker_local ) docker_local=$((docker_local + 1)); shift ;;
    -p | --docker_publish ) docker_publish=$((docker_publish + 1)); shift ;;
    -- ) shift; break ;;
    * ) break ;;
  esac
done

if (( $docker_local > 0 )); then
    echo "building image $image_name:$version_arg"
    docker buildx create --name uavcast_builder
    docker buildx use uavcast_builder
    docker buildx build --pull --rm \
    -t $image_name:$version_arg "." --output "type=docker,name=$image_name:${version_arg}"
fi

if (( $docker_publish > 0 )); then
    echo "building image $image_name:$version_arg"
    # run multiarch bild container
    #Docker Buildx
    docker buildx create --name uavcast_builder
    docker buildx use uavcast_builder
    docker run --privileged --rm tonistiigi/binfmt --install all

    docker buildx build --pull --rm \
    --platform linux/arm,linux/arm64,linux/amd64 \
    -t $image_name:$version_arg "." --push
fi
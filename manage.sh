#!/usr/bin/env bash
CMD=$1
APP="my-todolist"
VERSION="0.0.1"
TAG="${APP}:${VERSION}"

case $CMD in
    "build")
        docker build -t ${TAG} .
    ;;
    "clean")
        docker system prune
    ;;
    "run")
        docker run --name ${APP}-${VERSION} -dP ${TAG}
    ;;
    *)
    echo "Invalid option. Options are:"
    echo "build -- build the container locally."
    echo "clean -- clean the docker environment (containers and images)."
    echo "run -- run the built container locally."
    ;;
esac

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
    "mini")
        eval $(minikube docker-env)
        docker build -t ${TAG} .
        kubectl apply -f deployment.yaml
        kubectl expose deployment todolist --type=NodePort
        SVC_URL=$(minikube service todolist --url)
        echo ${SVC_URL}
    ;;
    "run")
        docker run --name ${APP}-${VERSION} -dP ${TAG}
    ;;
    *)
    echo "Invalid option. Options are:"
    echo "build -- build the container locally."
    echo "clean -- clean the docker environment (containers and images)."
    echo "run -- run the built container locally."
    echo "mini -- build and create the application on minikube."
    ;;
esac

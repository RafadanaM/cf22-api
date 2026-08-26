#!/bin/bash

set -e

export IMAGE_TAG=sha-$(git rev-parse --short HEAD)

echo "Pulling image with tag: $IMAGE_TAG"
docker compose pull

echo "Running image with tag: $IMAGE_TAG"
docker compose up -d --remove-orphans

echo "Pruning unused images..."
docker image prune -f

echo "Deployment complete"

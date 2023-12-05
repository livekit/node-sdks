#!/usr/bin/env bash

set -x
set -e

rm -rf ./src/proto/*

protoc --es_out src/proto --es_opt target=ts -I./protocol ./protocol/livekit_egress.proto ./protocol/livekit_ingress.proto ./protocol/livekit_room.proto ./protocol/livekit_webhook.proto ./protocol/livekit_models.proto

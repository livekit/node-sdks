#!/usr/bin/env bash

set -x
set -e

rm -rf ./src/proto/*

OPTS="esModuleInterop=true,useOptionals=all,outputClientImpl=false"
# ts-proto has a bug when generating timestamp fields
MODEL_OPTS="esModuleInterop=true,useOptionals=messages,outputClientImpl=false"

# Generate all protos for the browser
protoc --plugin="./node_modules/ts-proto/protoc-gen-ts_proto" \
       --ts_proto_out="./src/proto" \
       --ts_proto_opt="${OPTS}" \
       -I"./protocol/" \
       ./protocol/livekit_egress.proto ./protocol/livekit_room.proto ./protocol/livekit_webhook.proto

# Generate model to ensure it doesn't have optional timestamps
protoc --plugin="./node_modules/ts-proto/protoc-gen-ts_proto" \
       --ts_proto_out="./src/proto" \
       --ts_proto_opt="${MODEL_OPTS}" \
       -I"./protocol/" \
       ./protocol/livekit_models.proto


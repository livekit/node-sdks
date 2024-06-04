#!/bin/bash

# SPDX-FileCopyrightText: 2024 LiveKit, Inc.
#
# SPDX-License-Identifier: Apache-2.0

# This script requires protobuf-compiler and https://github.com/nipunn1313/mypy-protobuf

FFI_PROTOCOL=./rust-sdks/livekit-ffi/protocol
FFI_OUT_NODE=./src/proto

# ffi

protoc \
    -I=$FFI_PROTOCOL \
    --es_out $FFI_OUT_NODE \
    --es_opt target=ts \
    $FFI_PROTOCOL/audio_frame.proto \
    $FFI_PROTOCOL/ffi.proto \
    $FFI_PROTOCOL/handle.proto \
    $FFI_PROTOCOL/participant.proto \
    $FFI_PROTOCOL/room.proto \
    $FFI_PROTOCOL/track.proto \
    $FFI_PROTOCOL/video_frame.proto \
    $FFI_PROTOCOL/e2ee.proto \
    $FFI_PROTOCOL/stats.proto

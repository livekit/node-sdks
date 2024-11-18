// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { create } from '@bufbuild/protobuf';
import { FfiClient } from './ffi_client.js';
import { FfiRequestSchema } from './proto/ffi_pb.js';
import type {
  OwnedVideoBuffer,
  VideoBufferInfo,
  VideoBufferInfo_ComponentInfo,
  VideoConvertResponse,
} from './proto/video_frame_pb.js';
import {
  VideoBufferInfoSchema,
  VideoBufferInfo_ComponentInfoSchema,
  VideoBufferType,
} from './proto/video_frame_pb.js';

export class VideoFrame {
  data: Uint8Array;
  width: number;
  height: number;
  type: VideoBufferType;

  constructor(data: Uint8Array, width: number, height: number, type: VideoBufferType) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  /** @internal */
  get dataPtr(): bigint {
    return FfiClient.instance.retrievePtr(new Uint8Array(this.data.buffer));
  }

  /** @internal */
  protoInfo(): VideoBufferInfo {
    const info = create(VideoBufferInfoSchema, {
      width: this.width,
      height: this.height,
      type: this.type,
      dataPtr: this.dataPtr,
    });

    switch (this.type) {
      case VideoBufferType.ARGB:
      case VideoBufferType.RGBA:
      case VideoBufferType.ABGR:
      case VideoBufferType.BGRA:
        info.stride = this.width * 4;
        break;
      case VideoBufferType.RGB24:
        info.stride = this.width * 3;
        break;
    }

    info.components.push(...getPlaneInfos(this.dataPtr, this.type, this.width, this.height));

    return info;
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoBuffer): VideoFrame {
    const info = owned.info!;
    return new VideoFrame(
      FfiClient.instance.copyBuffer(
        info.dataPtr,
        getPlaneLength(info.type, info.width, info.height),
      ),
      info.width,
      info.height,
      info.type,
    );
  }

  getPlane(planeNth: number): Uint8Array | void {
    const planeInfos = getPlaneInfos(this.dataPtr, this.type, this.width, this.height);
    if (planeNth >= planeInfos.length) return;

    const planeInfo = planeInfos[planeNth]!;
    return FfiClient.instance.copyBuffer(planeInfo.dataPtr, planeInfo.size);
  }

  convert(dstType: VideoBufferType, flipY = false): VideoFrame {
    const req = create(FfiRequestSchema, {
      message: {
        case: 'videoConvert',
        value: {
          flipY,
          dstType,
          buffer: this.protoInfo(),
        },
      },
    });
    const resp = FfiClient.instance.request<VideoConvertResponse>(req);
    if (resp.message.case !== 'buffer') {
      throw new Error(resp.message.value ?? 'Unknown Error');
    }

    return VideoFrame.fromOwnedInfo(resp.message.value);
  }
}

const getPlaneLength = (type: VideoBufferType, width: number, height: number): number => {
  const chromaWidth = Math.trunc((width + 1) / 2);
  const chromaHeight = Math.trunc((height + 1) / 2);
  switch (type) {
    case VideoBufferType.ARGB:
    case VideoBufferType.RGBA:
    case VideoBufferType.ABGR:
    case VideoBufferType.BGRA:
      return width * height * 4;
    case VideoBufferType.RGB24:
    case VideoBufferType.I444:
      return width * height * 3;
    case VideoBufferType.I420:
      return width * height + chromaWidth * chromaHeight * 2;
    case VideoBufferType.I420A:
      return width * height * 2 + chromaWidth * chromaWidth * 2;
    case VideoBufferType.I422:
      return width * height + chromaWidth * height * 2;
    case VideoBufferType.I010:
      return width * height * 2 + chromaWidth * chromaHeight * 4;
    case VideoBufferType.NV12:
      return width * height + chromaWidth * chromaWidth * 2;
  }
};

const getPlaneInfos = (
  dataPtr: bigint,
  type: VideoBufferType,
  width: number,
  height: number,
): VideoBufferInfo_ComponentInfo[] => {
  const chromaWidth = Math.trunc((width + 1) / 2);
  const chromaHeight = Math.trunc((height + 1) / 2);
  switch (type) {
    case VideoBufferType.I420: {
      const y = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr,
        stride: width,
        size: width * height,
      });
      const u = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: y.dataPtr + BigInt(y.size),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      const v = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: u.dataPtr + BigInt(u.size),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      return [y, u, v];
    }
    case VideoBufferType.I420A: {
      const y = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr,
        stride: width,
        size: width * height,
      });
      const u = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: y.dataPtr + BigInt(y.size),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      const v = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: u.dataPtr + BigInt(u.size),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      const a = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: v.dataPtr + BigInt(v.size),
        stride: width,
        size: width * height,
      });
      return [y, u, v, a];
    }
    case VideoBufferType.I422: {
      const y = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr,
        stride: width,
        size: width * height,
      });
      const u = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: y.dataPtr + BigInt(y.size),
        stride: chromaWidth,
        size: chromaWidth * height,
      });
      const v = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: u.dataPtr + BigInt(u.size),
        stride: chromaWidth,
        size: chromaWidth * height,
      });
      return [y, u, v];
    }
    case VideoBufferType.I444: {
      const y = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr,
        stride: width,
        size: width * height,
      });
      const u = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: y.dataPtr + BigInt(y.size),
        stride: width,
        size: width * height,
      });
      const v = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: u.dataPtr + BigInt(u.size),
        stride: width,
        size: width * height,
      });
      return [y, u, v];
    }
    case VideoBufferType.I010: {
      const y = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr,
        stride: width * 2,
        size: width * height * 2,
      });
      const u = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: y.dataPtr + BigInt(y.size),
        stride: chromaWidth * 2,
        size: chromaWidth * chromaHeight * 2,
      });
      const v = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: u.dataPtr + BigInt(u.size),
        stride: chromaWidth * 2,
        size: chromaWidth * chromaHeight * 2,
      });
      return [y, u, v];
    }
    case VideoBufferType.NV12: {
      const y = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr,
        stride: width,
        size: width * height,
      });
      const uv = create(VideoBufferInfo_ComponentInfoSchema, {
        dataPtr: y.dataPtr + BigInt(y.size),
        stride: chromaWidth * 2,
        size: chromaWidth * chromaHeight * 2,
      });
      return [y, uv];
    }
    default:
      return [];
  }
};

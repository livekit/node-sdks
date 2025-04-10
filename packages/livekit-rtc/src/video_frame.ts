// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { FfiClient, FfiHandle, FfiRequest } from './ffi_client.js';
import type { OwnedVideoBuffer, VideoConvertResponse } from './proto/video_frame_pb.js';
import {
  VideoBufferInfo,
  VideoBufferInfo_ComponentInfo,
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
    const info = new VideoBufferInfo({
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
      default:
        info.stride = 0;
    }

    info.components.push(...getPlaneInfos(this.dataPtr, this.type, this.width, this.height));

    return info;
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoBuffer): VideoFrame {
    const info = owned.info!;
    const frame = new VideoFrame(
      FfiClient.instance.copyBuffer(
        info.dataPtr!,
        getPlaneLength(info.type!, info.width!, info.height!),
      ),
      info.width!,
      info.height!,
      info.type!,
    );
    // Dispose of the handle to prevent memory leaks
    new FfiHandle(owned.handle!.id!).dispose();
    return frame;
  }

  getPlane(planeNth: number): Uint8Array | void {
    const planeInfos = getPlaneInfos(this.dataPtr, this.type, this.width, this.height);
    if (planeNth >= planeInfos.length) return;

    const planeInfo = planeInfos[planeNth]!;
    return FfiClient.instance.copyBuffer(planeInfo.dataPtr!, planeInfo.size!);
  }

  convert(dstType: VideoBufferType, flipY = false): VideoFrame {
    const req = new FfiRequest({
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

    switch (resp.message.case) {
      case 'buffer':
        return VideoFrame.fromOwnedInfo(resp.message.value);
      case 'error':
      default:
        throw resp.message.value;
    }
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
      const y = new VideoBufferInfo_ComponentInfo({ dataPtr, stride: width, size: width * height });
      const u = new VideoBufferInfo_ComponentInfo({
        dataPtr: y.dataPtr! + BigInt(y.size!),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      const v = new VideoBufferInfo_ComponentInfo({
        dataPtr: u.dataPtr! + BigInt(u.size!),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      return [y, u, v];
    }
    case VideoBufferType.I420A: {
      const y = new VideoBufferInfo_ComponentInfo({ dataPtr, stride: width, size: width * height });
      const u = new VideoBufferInfo_ComponentInfo({
        dataPtr: y.dataPtr! + BigInt(y.size!),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      const v = new VideoBufferInfo_ComponentInfo({
        dataPtr: u.dataPtr! + BigInt(u.size!),
        stride: chromaWidth,
        size: chromaWidth * chromaHeight,
      });
      const a = new VideoBufferInfo_ComponentInfo({
        dataPtr: v.dataPtr! + BigInt(v.size!),
        stride: width,
        size: width * height,
      });
      return [y, u, v, a];
    }
    case VideoBufferType.I422: {
      const y = new VideoBufferInfo_ComponentInfo({ dataPtr, stride: width, size: width * height });
      const u = new VideoBufferInfo_ComponentInfo({
        dataPtr: y.dataPtr! + BigInt(y.size!),
        stride: chromaWidth,
        size: chromaWidth * height,
      });
      const v = new VideoBufferInfo_ComponentInfo({
        dataPtr: u.dataPtr! + BigInt(u.size!),
        stride: chromaWidth,
        size: chromaWidth * height,
      });
      return [y, u, v];
    }
    case VideoBufferType.I444: {
      const y = new VideoBufferInfo_ComponentInfo({ dataPtr, stride: width, size: width * height });
      const u = new VideoBufferInfo_ComponentInfo({
        dataPtr: y.dataPtr! + BigInt(y.size!),
        stride: width,
        size: width * height,
      });
      const v = new VideoBufferInfo_ComponentInfo({
        dataPtr: u.dataPtr! + BigInt(u.size!),
        stride: width,
        size: width * height,
      });
      return [y, u, v];
    }
    case VideoBufferType.I010: {
      const y = new VideoBufferInfo_ComponentInfo({
        dataPtr,
        stride: width * 2,
        size: width * height * 2,
      });
      const u = new VideoBufferInfo_ComponentInfo({
        dataPtr: y.dataPtr! + BigInt(y.size!),
        stride: chromaWidth * 2,
        size: chromaWidth * chromaHeight * 2,
      });
      const v = new VideoBufferInfo_ComponentInfo({
        dataPtr: u.dataPtr! + BigInt(u.size!),
        stride: chromaWidth * 2,
        size: chromaWidth * chromaHeight * 2,
      });
      return [y, u, v];
    }
    case VideoBufferType.NV12: {
      const y = new VideoBufferInfo_ComponentInfo({ dataPtr, stride: width, size: width * height });
      const uv = new VideoBufferInfo_ComponentInfo({
        dataPtr: y.dataPtr! + BigInt(y.size!),
        stride: chromaWidth * 2,
        size: chromaWidth * chromaHeight * 2,
      });
      return [y, uv];
    }
    default:
      return [];
  }
};

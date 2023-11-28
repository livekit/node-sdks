import { FfiClient, FfiHandle, FfiRequest } from './ffi_client';
import {
  BiplanarYuvBufferInfo,
  OwnedVideoFrameBuffer,
  PlanarYuvBufferInfo,
  ToI420Request,
  ToI420Response,
  VideoFormatType,
  VideoFrameBufferInfo,
  VideoFrameBufferType,
  VideoRotation,
} from './proto/video_frame_pb';

export class VideoFrame {
  timestampUs: number;
  rotation: VideoRotation;
  buffer: VideoFrameBuffer;

  constructor(timestampUs: number, rotation: VideoRotation, buffer: VideoFrameBuffer) {
    this.timestampUs = timestampUs;
    this.rotation = rotation;
    this.buffer = buffer;
  }
}

export abstract class VideoFrameBuffer {
  data: Uint8Array;
  width: number;
  height: number;
  bufferType: VideoFrameBufferType;

  constructor(data: Uint8Array, width: number, height: number, bufferType: VideoFrameBufferType) {
    this.data = data;
    this.width = width;
    this.height = height;
    this.bufferType = bufferType;
  }

  /** @internal */
  abstract protoInfo(): VideoFrameBufferInfo;

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): VideoFrameBuffer {
    let info = owned.info;
    switch (info.bufferType) {
      case VideoFrameBufferType.NATIVE:
        return NativeBuffer.fromOwnedInfo(owned);
      case VideoFrameBufferType.I420:
        return I420Buffer.fromOwnedInfo(owned);
      case VideoFrameBufferType.I420A:
        return I420ABuffer.fromOwnedInfo(owned);
      case VideoFrameBufferType.I422:
        return I422Buffer.fromOwnedInfo(owned);
      case VideoFrameBufferType.I444:
        return I444Buffer.fromOwnedInfo(owned);
      case VideoFrameBufferType.I010:
        return I010Buffer.fromOwnedInfo(owned);
      case VideoFrameBufferType.NV12:
        return NV12Buffer.fromOwnedInfo(owned);
    }
  }
}

export class NativeBuffer extends VideoFrameBuffer {
  private info: VideoFrameBufferInfo;

  constructor(ownedInfo: OwnedVideoFrameBuffer) {
    super(new Uint8Array(), ownedInfo.info.width, ownedInfo.info.height, ownedInfo.info.bufferType);
    this.info = ownedInfo.info;
  }

  /** @internal */
  protoInfo(): VideoFrameBufferInfo {
    return this.info;
  }
}

export abstract class PlanarYuvBuffer extends VideoFrameBuffer {
  strideY: number;
  strideU: number;
  strideV: number;
  chromaWidth: number;
  chromaHeight: number;

  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    bufferType: VideoFrameBufferType,
    stride_y: number,
    stride_u: number,
    stride_v: number,
    chroma_width: number,
    chroma_height: number,
  ) {
    super(data, width, height, bufferType);
    this.strideY = stride_y;
    this.strideU = stride_u;
    this.strideV = stride_v;
    this.chromaWidth = chroma_width;
    this.chromaHeight = chroma_height;
  }

  /** @internal */
  protoInfo(): VideoFrameBufferInfo {
    let info = new VideoFrameBufferInfo({
      width: this.width,
      height: this.height,
      bufferType: this.bufferType,
      buffer: {
        case: 'yuv',
        value: new PlanarYuvBufferInfo({
          strideY: this.strideY,
          strideU: this.strideU,
          strideV: this.strideV,
          chromaWidth: this.chromaWidth,
          chromaHeight: this.chromaHeight,
        }),
      },
    });
    return info;
  }
}

export abstract class PlanarYuv8Buffer extends PlanarYuvBuffer {
  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    bufferType: VideoFrameBufferType,
    stride_y: number,
    stride_u: number,
    stride_v: number,
    chroma_width: number,
    chroma_height: number,
  ) {
    super(
      data,
      width,
      height,
      bufferType,
      stride_y,
      stride_u,
      stride_v,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  protoInfo(): VideoFrameBufferInfo {
    let info = super.protoInfo();
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    yuv.dataYPtr = FfiClient.instance.retrievePtr(this.dataY());
    yuv.dataUPtr = FfiClient.instance.retrievePtr(this.dataU());
    yuv.dataVPtr = FfiClient.instance.retrievePtr(this.dataV());
    return info;
  }

  dataY(): Uint8Array {
    return this.data.subarray(0, this.strideY * this.height);
  }

  dataU(): Uint8Array {
    return this.data.subarray(
      this.strideY * this.height,
      this.strideY * this.height + this.strideU * this.chromaHeight,
    );
  }

  dataV(): Uint8Array {
    return this.data.subarray(
      this.strideY * this.height + this.strideU * this.chromaHeight,
      this.strideY * this.height +
        this.strideU * this.chromaHeight +
        this.strideV * this.chromaHeight,
    );
  }
}

export abstract class PlanarYuv16Buffer extends PlanarYuvBuffer {
  constructor(
    data: Uint16Array,
    width: number,
    height: number,
    bufferType: VideoFrameBufferType,
    stride_y: number,
    stride_u: number,
    stride_v: number,
    chroma_width: number,
    chroma_height: number,
  ) {
    super(
      new Uint8Array(data),
      width,
      height,
      bufferType,
      stride_y,
      stride_u,
      stride_v,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  protoInfo(): VideoFrameBufferInfo {
    let info = super.protoInfo();
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    yuv.dataYPtr = FfiClient.instance.retrievePtr(new Uint8Array(this.dataY()));
    yuv.dataUPtr = FfiClient.instance.retrievePtr(new Uint8Array(this.dataU()));
    yuv.dataVPtr = FfiClient.instance.retrievePtr(new Uint8Array(this.dataV()));
    return info;
  }

  dataY(): Uint16Array {
    return new Uint16Array(this.data.subarray(0, this.strideY * this.height));
  }

  dataU(): Uint16Array {
    return new Uint16Array(
      this.data.subarray(
        this.strideY * this.height,
        this.strideY * this.height + this.strideU * this.chromaHeight,
      ),
    );
  }

  dataV(): Uint16Array {
    return new Uint16Array(
      this.data.subarray(
        this.strideY * this.height + this.strideU * this.chromaHeight,
        this.strideY * this.height +
          this.strideU * this.chromaHeight +
          this.strideV * this.chromaHeight,
      ),
    );
  }
}

export abstract class BiplanarYuv8Buffer extends VideoFrameBuffer {
  strideY: number;
  strideUV: number;
  chromaWidth: number;
  chromaHeight: number;

  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    bufferType: VideoFrameBufferType,
    stride_y: number,
    stride_uv: number,
    chroma_width: number,
    chroma_height: number,
  ) {
    super(data, width, height, bufferType);
    this.strideY = stride_y;
    this.strideUV = stride_uv;
    this.chromaWidth = chroma_width;
    this.chromaHeight = chroma_height;
  }

  /** @internal */
  protoInfo(): VideoFrameBufferInfo {
    let info = new VideoFrameBufferInfo({
      width: this.width,
      height: this.height,
      bufferType: this.bufferType,
      buffer: {
        case: 'biYuv',
        value: new BiplanarYuvBufferInfo({
          strideY: this.strideY,
          strideUv: this.strideUV,
          chromaWidth: this.chromaWidth,
          chromaHeight: this.chromaHeight,
        }),
      },
    });

    return info;
  }

  dataY(): Uint8Array {
    return this.data.subarray(0, this.strideY * this.height);
  }

  dataUV(): Uint8Array {
    return this.data.subarray(
      this.strideY * this.height,
      this.strideY * this.height + this.strideUV * this.chromaHeight,
    );
  }
}

export class I420Buffer extends PlanarYuv8Buffer {
  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    stride_y: number,
    stride_u: number,
    stride_v: number,
  ) {
    let chroma_width = ~~((width + 1) / 2);
    let chroma_height = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I420,
      stride_y,
      stride_u,
      stride_v,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I420Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let stride_y = yuv.strideY;
    let stride_u = yuv.strideU;
    let stride_v = yuv.strideV;
    let nbytes = I420Buffer.calcDataSize(info.width, info.height, stride_y, stride_u, stride_v);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I420Buffer(data, info.width, info.height, stride_y, stride_u, stride_v);
  }

  static calcDataSize(
    width: number,
    height: number,
    stride_y: number,
    stride_u: number,
    stride_v: number,
  ): number {
    let chroma_height = ~~((height + 1) / 2);
    return stride_y * height + stride_u * chroma_height + stride_v * chroma_height;
  }

  static create(width: number, height: number): I420Buffer {
    let stride_y = width;
    let stride_u = ~~((width + 1) / 2);
    let stride_v = ~~((width + 1) / 2);
    let data_size = I420Buffer.calcDataSize(width, height, stride_y, stride_u, stride_v);
    let data = new Uint8Array(data_size);
    return new I420Buffer(data, width, height, stride_y, stride_u, stride_v);
  }
}

export class I420ABuffer extends PlanarYuv8Buffer {
  strideA: number;

  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    strideY: number,
    strideU: number,
    strideV: number,
    strideA: number,
  ) {
    let chroma_width = ~~((width + 1) / 2);
    let chroma_height = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I420A,
      strideY,
      strideU,
      strideV,
      chroma_width,
      chroma_height,
    );
    this.strideA = strideA;
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I420ABuffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let stride_y = yuv.strideY;
    let stride_u = yuv.strideU;
    let stride_v = yuv.strideV;
    let stride_a = yuv.strideA;
    let nbytes = I420ABuffer.calcDataSize(info.height, stride_y, stride_u, stride_v, stride_a);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I420ABuffer(data, info.width, info.height, stride_y, stride_u, stride_v, stride_a);
  }

  static calcDataSize(
    height: number,
    stride_y: number,
    stride_u: number,
    stride_v: number,
    stride_a: number,
  ): number {
    let chroma_height = ~~((height + 1) / 2);
    return (
      stride_y * height + stride_u * chroma_height + stride_v * chroma_height + stride_a * height
    );
  }

  dataA(): Uint8Array {
    return this.data.subarray(
      this.strideY * this.height +
        this.strideU * this.chromaHeight +
        this.strideV * this.chromaHeight,
      this.strideY * this.height +
        this.strideU * this.chromaHeight +
        this.strideV * this.chromaHeight +
        this.strideA * this.height,
    );
  }
}

export class I422Buffer extends PlanarYuv8Buffer {
  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    strideY: number,
    strideU: number,
    strideV: number,
  ) {
    let chroma_width = ~~((width + 1) / 2);
    let chroma_height = height;
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I422,
      strideY,
      strideU,
      strideV,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I422Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let stride_y = yuv.strideY;
    let stride_u = yuv.strideU;
    let stride_v = yuv.strideV;
    let nbytes = I422Buffer.calcDataSize(info.height, stride_y, stride_u, stride_v);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I422Buffer(data, info.width, info.height, stride_y, stride_u, stride_v);
  }

  static calcDataSize(
    height: number,
    stride_y: number,
    stride_u: number,
    stride_v: number,
  ): number {
    return stride_y * height + stride_u * height + stride_v * height;
  }
}

export class I444Buffer extends PlanarYuv8Buffer {
  constructor(
    data: Uint8Array,
    width: number,
    height: number,
    strideY: number,
    strideU: number,
    strideV: number,
  ) {
    let chroma_width = width;
    let chroma_height = height;
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I444,
      strideY,
      strideU,
      strideV,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I444Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let stride_y = yuv.strideY;
    let stride_u = yuv.strideU;
    let stride_v = yuv.strideV;
    let nbytes = I444Buffer.calcDataSize(info.height, stride_y, stride_u, stride_v);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I444Buffer(data, info.width, info.height, stride_y, stride_u, stride_v);
  }

  static calcDataSize(
    height: number,
    stride_y: number,
    stride_u: number,
    stride_v: number,
  ): number {
    return stride_y * height + stride_u * height + stride_v * height;
  }
}

export class I010Buffer extends PlanarYuv16Buffer {
  constructor(
    data: Uint16Array,
    width: number,
    height: number,
    strideY: number,
    strideU: number,
    strideV: number,
  ) {
    let chroma_width = ~~((width + 1) / 2);
    let chroma_height = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I010,
      strideY,
      strideU,
      strideV,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I010Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let stride_y = yuv.strideY;
    let stride_u = yuv.strideU;
    let stride_v = yuv.strideV;
    let nbytes = I010Buffer.calcDataSize(info.height, stride_y, stride_u, stride_v);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I010Buffer(
      new Uint16Array(data),
      info.width,
      info.height,
      stride_y,
      stride_u,
      stride_v,
    );
  }

  static calcDataSize(
    height: number,
    stride_y: number,
    stride_u: number,
    stride_v: number,
  ): number {
    let chroma_height = ~~((height + 1) / 2);
    return (stride_y * height + stride_u * chroma_height + stride_v * chroma_height) * 2;
  }
}

export class NV12Buffer extends BiplanarYuv8Buffer {
  constructor(data: Uint8Array, width: number, height: number, strideY: number, strideUV: number) {
    let chroma_width = ~~((width + 1) / 2);
    let chroma_height = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.NV12,
      strideY,
      strideUV,
      chroma_width,
      chroma_height,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): NV12Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as BiplanarYuvBufferInfo;
    let stride_y = yuv.strideY;
    let stride_uv = yuv.strideUv;
    let nbytes = NV12Buffer.calcDataSize(info.height, stride_y, stride_uv);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new NV12Buffer(data, info.width, info.height, stride_y, stride_uv);
  }

  static calcDataSize(height: number, stride_y: number, stride_uv: number): number {
    let chroma_height = ~~((height + 1) / 2);
    return stride_y * height + stride_uv * chroma_height;
  }
}

export class ArgbFrame {
  data: Uint8Array;
  format: VideoFormatType;
  width: number;
  height: number;
  stride: number;

  constructor(
    data: Uint8Array,
    format: VideoFormatType,
    width: number,
    height: number,
    stride: number = width * 4,
  ) {
    this.data = data;
    this.format = format;
    this.width = width;
    this.height = height;
    this.stride = stride;
  }

  static create(format: VideoFormatType, width: number, height: number): ArgbFrame {
    let data = new Uint8Array(width * height * 4);
    return new ArgbFrame(data, format, width, height);
  }

  toI420(): I420Buffer {
    let req = new ToI420Request({
      from: {
        case: 'argb',
        value: {
          format: this.format,
          width: this.width,
          height: this.height,
          stride: this.stride,
          ptr: FfiClient.instance.retrievePtr(this.data),
        },
      },
    });

    let resp = FfiClient.instance.request<ToI420Response>(
      new FfiRequest({
        message: {
          case: 'toI420',
          value: req,
        },
      }),
    );
    return I420Buffer.fromOwnedInfo(resp.buffer);
  }
}

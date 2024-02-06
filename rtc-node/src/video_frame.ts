import { FfiClient, FfiHandle } from './ffi_client.js';
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
} from './proto/video_frame_pb.js';

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
    strideY: number,
    strideU: number,
    strideV: number,
    chromaWidth: number,
    chromaHeight: number,
  ) {
    super(data, width, height, bufferType);
    this.strideY = strideY;
    this.strideU = strideU;
    this.strideV = strideV;
    this.chromaWidth = chromaWidth;
    this.chromaHeight = chromaHeight;
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
    strideY: number,
    strideU: number,
    strideV: number,
    chromaWidth: number,
    chromaHeight: number,
  ) {
    super(data, width, height, bufferType, strideY, strideU, strideV, chromaWidth, chromaHeight);
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
    strideY: number,
    strideU: number,
    strideV: number,
    chromaWidth: number,
    chromaHeight: number,
  ) {
    super(
      new Uint8Array(data),
      width,
      height,
      bufferType,
      strideY,
      strideU,
      strideV,
      chromaWidth,
      chromaHeight,
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
    strideY: number,
    strideUV: number,
    chromaWidth: number,
    chromaHeight: number,
  ) {
    super(data, width, height, bufferType);
    this.strideY = strideY;
    this.strideUV = strideUV;
    this.chromaWidth = chromaWidth;
    this.chromaHeight = chromaHeight;
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
    strideY: number,
    strideU: number,
    strideV: number,
  ) {
    let chromaWidth = ~~((width + 1) / 2);
    let chromaHeight = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I420,
      strideY,
      strideU,
      strideV,
      chromaWidth,
      chromaHeight,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I420Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let strideY = yuv.strideY;
    let strideU = yuv.strideU;
    let strideV = yuv.strideV;
    let nbytes = I420Buffer.calcDataSize(info.height, strideY, strideU, strideV);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I420Buffer(data, info.width, info.height, strideY, strideU, strideV);
  }

  static calcDataSize(height: number, strideY: number, strideU: number, strideV: number): number {
    let chromaHeight = ~~((height + 1) / 2);
    return strideY * height + strideU * chromaHeight + strideV * chromaHeight;
  }

  static create(width: number, height: number): I420Buffer {
    let strideY = width;
    let strideU = ~~((width + 1) / 2);
    let strideV = ~~((width + 1) / 2);
    let dataSize = I420Buffer.calcDataSize(height, strideY, strideU, strideV);
    let data = new Uint8Array(dataSize);
    return new I420Buffer(data, width, height, strideY, strideU, strideV);
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
    let chromaWidth = ~~((width + 1) / 2);
    let chromaHeight = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I420A,
      strideY,
      strideU,
      strideV,
      chromaWidth,
      chromaHeight,
    );
    this.strideA = strideA;
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I420ABuffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let strideY = yuv.strideY;
    let strideU = yuv.strideU;
    let strideV = yuv.strideV;
    let strideA = yuv.strideA;
    let nbytes = I420ABuffer.calcDataSize(info.height, strideY, strideU, strideV, strideA);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I420ABuffer(data, info.width, info.height, strideY, strideU, strideV, strideA);
  }

  static calcDataSize(
    height: number,
    strideY: number,
    strideU: number,
    strideV: number,
    strideA: number,
  ): number {
    let chromaHeight = ~~((height + 1) / 2);
    return strideY * height + strideU * chromaHeight + strideV * chromaHeight + strideA * height;
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
    let chromaWidth = ~~((width + 1) / 2);
    let chromaHeight = height;
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I422,
      strideY,
      strideU,
      strideV,
      chromaWidth,
      chromaHeight,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I422Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let strideY = yuv.strideY;
    let strideU = yuv.strideU;
    let strideV = yuv.strideV;
    let nbytes = I422Buffer.calcDataSize(info.height, strideY, strideU, strideV);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I422Buffer(data, info.width, info.height, strideY, strideU, strideV);
  }

  static calcDataSize(height: number, strideY: number, strideU: number, strideV: number): number {
    return strideY * height + strideU * height + strideV * height;
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
    let chromaWidth = width;
    let chromaHeight = height;
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I444,
      strideY,
      strideU,
      strideV,
      chromaWidth,
      chromaHeight,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I444Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let strideY = yuv.strideY;
    let strideU = yuv.strideU;
    let strideV = yuv.strideV;
    let nbytes = I444Buffer.calcDataSize(info.height, strideY, strideU, strideV);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I444Buffer(data, info.width, info.height, strideY, strideU, strideV);
  }

  static calcDataSize(height: number, strideY: number, strideU: number, strideV: number): number {
    return strideY * height + strideU * height + strideV * height;
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
    let chromaWidth = ~~((width + 1) / 2);
    let chromaHeight = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.I010,
      strideY,
      strideU,
      strideV,
      chromaWidth,
      chromaHeight,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): I010Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as PlanarYuvBufferInfo;
    let strideY = yuv.strideY;
    let strideU = yuv.strideU;
    let strideV = yuv.strideV;
    let nbytes = I010Buffer.calcDataSize(info.height, strideY, strideU, strideV);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new I010Buffer(
      new Uint16Array(data),
      info.width,
      info.height,
      strideY,
      strideU,
      strideV,
    );
  }

  static calcDataSize(height: number, strideY: number, strideU: number, strideV: number): number {
    let chromaHeight = ~~((height + 1) / 2);
    return (strideY * height + strideU * chromaHeight + strideV * chromaHeight) * 2;
  }
}

export class NV12Buffer extends BiplanarYuv8Buffer {
  constructor(data: Uint8Array, width: number, height: number, strideY: number, strideUV: number) {
    let chromaWidth = ~~((width + 1) / 2);
    let chromaHeight = ~~((height + 1) / 2);
    super(
      data,
      width,
      height,
      VideoFrameBufferType.NV12,
      strideY,
      strideUV,
      chromaWidth,
      chromaHeight,
    );
  }

  /** @internal */
  static fromOwnedInfo(owned: OwnedVideoFrameBuffer): NV12Buffer {
    let info = owned.info;
    let yuv = info.buffer.value as BiplanarYuvBufferInfo;
    let strideY = yuv.strideY;
    let strideUV = yuv.strideUv;
    let nbytes = NV12Buffer.calcDataSize(info.height, strideY, strideUV);
    let data = FfiClient.instance.copyBuffer(yuv.dataYPtr, nbytes);
    new FfiHandle(owned.handle.id).dispose();
    return new NV12Buffer(data, info.width, info.height, strideY, strideUV);
  }

  static calcDataSize(height: number, strideY: number, strideUV: number): number {
    let chromaHeight = ~~((height + 1) / 2);
    return strideY * height + strideUV * chromaHeight;
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

    let resp = FfiClient.instance.request<ToI420Response>({
      message: {
        case: 'toI420',
        value: req,
      },
    });
    return I420Buffer.fromOwnedInfo(resp.buffer);
  }
}

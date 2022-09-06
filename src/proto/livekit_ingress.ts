/* eslint-disable */
import Long from 'long';
import * as _m0 from 'protobufjs/minimal';
import {
  TrackSource,
  VideoLayer,
  TrackInfo,
  trackSourceFromJSON,
  trackSourceToJSON,
} from './livekit_models';

export const protobufPackage = 'livekit';

export enum IngressInput {
  /**
   * RTMP_INPUT - FILE_INPUT = 1;
   *    SRT_INPUT = 2;
   *    URL_INPUT = 3;
   */
  RTMP_INPUT = 0,
  UNRECOGNIZED = -1,
}

export function ingressInputFromJSON(object: any): IngressInput {
  switch (object) {
    case 0:
    case 'RTMP_INPUT':
      return IngressInput.RTMP_INPUT;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return IngressInput.UNRECOGNIZED;
  }
}

export function ingressInputToJSON(object: IngressInput): string {
  switch (object) {
    case IngressInput.RTMP_INPUT:
      return 'RTMP_INPUT';
    default:
      return 'UNKNOWN';
  }
}

export interface CreateIngressRequest {
  inputType: IngressInput;
  /** User provided identifier for the ingress */
  name: string;
  /** room to publish to */
  roomName: string;
  /** publish as participant */
  participantIdentity: string;
  /** name of publishing participant (used for display only) */
  participantName: string;
  audio?: IngressAudioOptions;
  video?: IngressVideoOptions;
}

export interface IngressAudioOptions {
  name: string;
  source: TrackSource;
  /** desired mime_type to publish to room */
  mimeType: string;
  bitrate: number;
  disableDtx: boolean;
  channels: number;
}

export interface IngressVideoOptions {
  name: string;
  source: TrackSource;
  /** desired mime_type to publish to room */
  mimeType: string;
  /**
   * simulcast layers to publish, when empty, it'll pick default simulcast
   * layers at 1/2 and 1/4 of the dimensions
   */
  layers: VideoLayer[];
}

export interface IngressInfo {
  ingressId: string;
  name: string;
  streamKey: string;
  url: string;
  /**
   * for RTMP input, it'll be a rtmp:// URL
   * for FILE input, it'll be a http:// URL
   * for SRT input, it'll be a srt:// URL
   */
  inputType: IngressInput;
  audio?: IngressAudioOptions;
  video?: IngressVideoOptions;
  roomName: string;
  participantIdentity: string;
  participantName: string;
  reusable: boolean;
  /** Description of error/stream non compliance and debug info for publisher otherwise (received bitrate, resolution, bandwidth) */
  state?: IngressState;
}

export interface IngressState {
  status: IngressState_Status;
  /** Error/non compliance description if any */
  error: string;
  video?: InputVideoState;
  audio?: InputAudioState;
  /** ID of the current/previous room published to */
  roomId: string;
  startedAt: number;
  tracks: TrackInfo[];
}

export enum IngressState_Status {
  ENDPOINT_INACTIVE = 0,
  ENDPOINT_BUFFERING = 1,
  ENDPOINT_PUBLISHING = 2,
  ENDPOINT_ERROR = 3,
  UNRECOGNIZED = -1,
}

export function ingressState_StatusFromJSON(object: any): IngressState_Status {
  switch (object) {
    case 0:
    case 'ENDPOINT_INACTIVE':
      return IngressState_Status.ENDPOINT_INACTIVE;
    case 1:
    case 'ENDPOINT_BUFFERING':
      return IngressState_Status.ENDPOINT_BUFFERING;
    case 2:
    case 'ENDPOINT_PUBLISHING':
      return IngressState_Status.ENDPOINT_PUBLISHING;
    case 3:
    case 'ENDPOINT_ERROR':
      return IngressState_Status.ENDPOINT_ERROR;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return IngressState_Status.UNRECOGNIZED;
  }
}

export function ingressState_StatusToJSON(object: IngressState_Status): string {
  switch (object) {
    case IngressState_Status.ENDPOINT_INACTIVE:
      return 'ENDPOINT_INACTIVE';
    case IngressState_Status.ENDPOINT_BUFFERING:
      return 'ENDPOINT_BUFFERING';
    case IngressState_Status.ENDPOINT_PUBLISHING:
      return 'ENDPOINT_PUBLISHING';
    case IngressState_Status.ENDPOINT_ERROR:
      return 'ENDPOINT_ERROR';
    default:
      return 'UNKNOWN';
  }
}

export interface InputVideoState {
  mimeType: number;
  /** uint32 bitrate = 2; */
  width: number;
  height: number;
  framerate: number;
}

export interface InputAudioState {
  mimeType: number;
  /** uint32 bitrate = 2; */
  channels: number;
  sampleRate: number;
}

export interface UpdateIngressRequest {
  ingressId: string;
  name: string;
  roomName: string;
  participantIdentity: string;
  participantName: string;
  audio?: IngressAudioOptions;
  video?: IngressVideoOptions;
}

export interface ListIngressRequest {
  /** when blank, lists all ingress endpoints */
  roomName: string;
}

export interface ListIngressResponse {
  items: IngressInfo[];
}

export interface DeleteIngressRequest {
  ingressId: string;
}

function createBaseCreateIngressRequest(): CreateIngressRequest {
  return {
    inputType: 0,
    name: '',
    roomName: '',
    participantIdentity: '',
    participantName: '',
    audio: undefined,
    video: undefined,
  };
}

export const CreateIngressRequest = {
  encode(message: CreateIngressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.inputType !== 0) {
      writer.uint32(8).int32(message.inputType);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.roomName !== '') {
      writer.uint32(26).string(message.roomName);
    }
    if (message.participantIdentity !== '') {
      writer.uint32(34).string(message.participantIdentity);
    }
    if (message.participantName !== '') {
      writer.uint32(42).string(message.participantName);
    }
    if (message.audio !== undefined) {
      IngressAudioOptions.encode(message.audio, writer.uint32(50).fork()).ldelim();
    }
    if (message.video !== undefined) {
      IngressVideoOptions.encode(message.video, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateIngressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateIngressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inputType = reader.int32() as any;
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.roomName = reader.string();
          break;
        case 4:
          message.participantIdentity = reader.string();
          break;
        case 5:
          message.participantName = reader.string();
          break;
        case 6:
          message.audio = IngressAudioOptions.decode(reader, reader.uint32());
          break;
        case 7:
          message.video = IngressVideoOptions.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateIngressRequest {
    return {
      inputType: isSet(object.inputType) ? ingressInputFromJSON(object.inputType) : 0,
      name: isSet(object.name) ? String(object.name) : '',
      roomName: isSet(object.roomName) ? String(object.roomName) : '',
      participantIdentity: isSet(object.participantIdentity)
        ? String(object.participantIdentity)
        : '',
      participantName: isSet(object.participantName) ? String(object.participantName) : '',
      audio: isSet(object.audio) ? IngressAudioOptions.fromJSON(object.audio) : undefined,
      video: isSet(object.video) ? IngressVideoOptions.fromJSON(object.video) : undefined,
    };
  },

  toJSON(message: CreateIngressRequest): unknown {
    const obj: any = {};
    message.inputType !== undefined && (obj.inputType = ingressInputToJSON(message.inputType));
    message.name !== undefined && (obj.name = message.name);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.participantIdentity !== undefined &&
      (obj.participantIdentity = message.participantIdentity);
    message.participantName !== undefined && (obj.participantName = message.participantName);
    message.audio !== undefined &&
      (obj.audio = message.audio ? IngressAudioOptions.toJSON(message.audio) : undefined);
    message.video !== undefined &&
      (obj.video = message.video ? IngressVideoOptions.toJSON(message.video) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateIngressRequest>, I>>(
    object: I,
  ): CreateIngressRequest {
    const message = createBaseCreateIngressRequest();
    message.inputType = object.inputType ?? 0;
    message.name = object.name ?? '';
    message.roomName = object.roomName ?? '';
    message.participantIdentity = object.participantIdentity ?? '';
    message.participantName = object.participantName ?? '';
    message.audio =
      object.audio !== undefined && object.audio !== null
        ? IngressAudioOptions.fromPartial(object.audio)
        : undefined;
    message.video =
      object.video !== undefined && object.video !== null
        ? IngressVideoOptions.fromPartial(object.video)
        : undefined;
    return message;
  },
};

function createBaseIngressAudioOptions(): IngressAudioOptions {
  return { name: '', source: 0, mimeType: '', bitrate: 0, disableDtx: false, channels: 0 };
}

export const IngressAudioOptions = {
  encode(message: IngressAudioOptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.source !== 0) {
      writer.uint32(16).int32(message.source);
    }
    if (message.mimeType !== '') {
      writer.uint32(26).string(message.mimeType);
    }
    if (message.bitrate !== 0) {
      writer.uint32(32).uint32(message.bitrate);
    }
    if (message.disableDtx === true) {
      writer.uint32(40).bool(message.disableDtx);
    }
    if (message.channels !== 0) {
      writer.uint32(48).uint32(message.channels);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IngressAudioOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIngressAudioOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.source = reader.int32() as any;
          break;
        case 3:
          message.mimeType = reader.string();
          break;
        case 4:
          message.bitrate = reader.uint32();
          break;
        case 5:
          message.disableDtx = reader.bool();
          break;
        case 6:
          message.channels = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IngressAudioOptions {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      source: isSet(object.source) ? trackSourceFromJSON(object.source) : 0,
      mimeType: isSet(object.mimeType) ? String(object.mimeType) : '',
      bitrate: isSet(object.bitrate) ? Number(object.bitrate) : 0,
      disableDtx: isSet(object.disableDtx) ? Boolean(object.disableDtx) : false,
      channels: isSet(object.channels) ? Number(object.channels) : 0,
    };
  },

  toJSON(message: IngressAudioOptions): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.source !== undefined && (obj.source = trackSourceToJSON(message.source));
    message.mimeType !== undefined && (obj.mimeType = message.mimeType);
    message.bitrate !== undefined && (obj.bitrate = Math.round(message.bitrate));
    message.disableDtx !== undefined && (obj.disableDtx = message.disableDtx);
    message.channels !== undefined && (obj.channels = Math.round(message.channels));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IngressAudioOptions>, I>>(
    object: I,
  ): IngressAudioOptions {
    const message = createBaseIngressAudioOptions();
    message.name = object.name ?? '';
    message.source = object.source ?? 0;
    message.mimeType = object.mimeType ?? '';
    message.bitrate = object.bitrate ?? 0;
    message.disableDtx = object.disableDtx ?? false;
    message.channels = object.channels ?? 0;
    return message;
  },
};

function createBaseIngressVideoOptions(): IngressVideoOptions {
  return { name: '', source: 0, mimeType: '', layers: [] };
}

export const IngressVideoOptions = {
  encode(message: IngressVideoOptions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.source !== 0) {
      writer.uint32(16).int32(message.source);
    }
    if (message.mimeType !== '') {
      writer.uint32(26).string(message.mimeType);
    }
    for (const v of message.layers) {
      VideoLayer.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IngressVideoOptions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIngressVideoOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.source = reader.int32() as any;
          break;
        case 3:
          message.mimeType = reader.string();
          break;
        case 4:
          message.layers.push(VideoLayer.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IngressVideoOptions {
    return {
      name: isSet(object.name) ? String(object.name) : '',
      source: isSet(object.source) ? trackSourceFromJSON(object.source) : 0,
      mimeType: isSet(object.mimeType) ? String(object.mimeType) : '',
      layers: Array.isArray(object?.layers)
        ? object.layers.map((e: any) => VideoLayer.fromJSON(e))
        : [],
    };
  },

  toJSON(message: IngressVideoOptions): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.source !== undefined && (obj.source = trackSourceToJSON(message.source));
    message.mimeType !== undefined && (obj.mimeType = message.mimeType);
    if (message.layers) {
      obj.layers = message.layers.map((e) => (e ? VideoLayer.toJSON(e) : undefined));
    } else {
      obj.layers = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IngressVideoOptions>, I>>(
    object: I,
  ): IngressVideoOptions {
    const message = createBaseIngressVideoOptions();
    message.name = object.name ?? '';
    message.source = object.source ?? 0;
    message.mimeType = object.mimeType ?? '';
    message.layers = object.layers?.map((e) => VideoLayer.fromPartial(e)) || [];
    return message;
  },
};

function createBaseIngressInfo(): IngressInfo {
  return {
    ingressId: '',
    name: '',
    streamKey: '',
    url: '',
    inputType: 0,
    audio: undefined,
    video: undefined,
    roomName: '',
    participantIdentity: '',
    participantName: '',
    reusable: false,
    state: undefined,
  };
}

export const IngressInfo = {
  encode(message: IngressInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ingressId !== '') {
      writer.uint32(10).string(message.ingressId);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.streamKey !== '') {
      writer.uint32(26).string(message.streamKey);
    }
    if (message.url !== '') {
      writer.uint32(34).string(message.url);
    }
    if (message.inputType !== 0) {
      writer.uint32(40).int32(message.inputType);
    }
    if (message.audio !== undefined) {
      IngressAudioOptions.encode(message.audio, writer.uint32(50).fork()).ldelim();
    }
    if (message.video !== undefined) {
      IngressVideoOptions.encode(message.video, writer.uint32(58).fork()).ldelim();
    }
    if (message.roomName !== '') {
      writer.uint32(66).string(message.roomName);
    }
    if (message.participantIdentity !== '') {
      writer.uint32(74).string(message.participantIdentity);
    }
    if (message.participantName !== '') {
      writer.uint32(82).string(message.participantName);
    }
    if (message.reusable === true) {
      writer.uint32(88).bool(message.reusable);
    }
    if (message.state !== undefined) {
      IngressState.encode(message.state, writer.uint32(98).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IngressInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIngressInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ingressId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.streamKey = reader.string();
          break;
        case 4:
          message.url = reader.string();
          break;
        case 5:
          message.inputType = reader.int32() as any;
          break;
        case 6:
          message.audio = IngressAudioOptions.decode(reader, reader.uint32());
          break;
        case 7:
          message.video = IngressVideoOptions.decode(reader, reader.uint32());
          break;
        case 8:
          message.roomName = reader.string();
          break;
        case 9:
          message.participantIdentity = reader.string();
          break;
        case 10:
          message.participantName = reader.string();
          break;
        case 11:
          message.reusable = reader.bool();
          break;
        case 12:
          message.state = IngressState.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IngressInfo {
    return {
      ingressId: isSet(object.ingressId) ? String(object.ingressId) : '',
      name: isSet(object.name) ? String(object.name) : '',
      streamKey: isSet(object.streamKey) ? String(object.streamKey) : '',
      url: isSet(object.url) ? String(object.url) : '',
      inputType: isSet(object.inputType) ? ingressInputFromJSON(object.inputType) : 0,
      audio: isSet(object.audio) ? IngressAudioOptions.fromJSON(object.audio) : undefined,
      video: isSet(object.video) ? IngressVideoOptions.fromJSON(object.video) : undefined,
      roomName: isSet(object.roomName) ? String(object.roomName) : '',
      participantIdentity: isSet(object.participantIdentity)
        ? String(object.participantIdentity)
        : '',
      participantName: isSet(object.participantName) ? String(object.participantName) : '',
      reusable: isSet(object.reusable) ? Boolean(object.reusable) : false,
      state: isSet(object.state) ? IngressState.fromJSON(object.state) : undefined,
    };
  },

  toJSON(message: IngressInfo): unknown {
    const obj: any = {};
    message.ingressId !== undefined && (obj.ingressId = message.ingressId);
    message.name !== undefined && (obj.name = message.name);
    message.streamKey !== undefined && (obj.streamKey = message.streamKey);
    message.url !== undefined && (obj.url = message.url);
    message.inputType !== undefined && (obj.inputType = ingressInputToJSON(message.inputType));
    message.audio !== undefined &&
      (obj.audio = message.audio ? IngressAudioOptions.toJSON(message.audio) : undefined);
    message.video !== undefined &&
      (obj.video = message.video ? IngressVideoOptions.toJSON(message.video) : undefined);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.participantIdentity !== undefined &&
      (obj.participantIdentity = message.participantIdentity);
    message.participantName !== undefined && (obj.participantName = message.participantName);
    message.reusable !== undefined && (obj.reusable = message.reusable);
    message.state !== undefined &&
      (obj.state = message.state ? IngressState.toJSON(message.state) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IngressInfo>, I>>(object: I): IngressInfo {
    const message = createBaseIngressInfo();
    message.ingressId = object.ingressId ?? '';
    message.name = object.name ?? '';
    message.streamKey = object.streamKey ?? '';
    message.url = object.url ?? '';
    message.inputType = object.inputType ?? 0;
    message.audio =
      object.audio !== undefined && object.audio !== null
        ? IngressAudioOptions.fromPartial(object.audio)
        : undefined;
    message.video =
      object.video !== undefined && object.video !== null
        ? IngressVideoOptions.fromPartial(object.video)
        : undefined;
    message.roomName = object.roomName ?? '';
    message.participantIdentity = object.participantIdentity ?? '';
    message.participantName = object.participantName ?? '';
    message.reusable = object.reusable ?? false;
    message.state =
      object.state !== undefined && object.state !== null
        ? IngressState.fromPartial(object.state)
        : undefined;
    return message;
  },
};

function createBaseIngressState(): IngressState {
  return {
    status: 0,
    error: '',
    video: undefined,
    audio: undefined,
    roomId: '',
    startedAt: 0,
    tracks: [],
  };
}

export const IngressState = {
  encode(message: IngressState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== 0) {
      writer.uint32(8).int32(message.status);
    }
    if (message.error !== '') {
      writer.uint32(18).string(message.error);
    }
    if (message.video !== undefined) {
      InputVideoState.encode(message.video, writer.uint32(26).fork()).ldelim();
    }
    if (message.audio !== undefined) {
      InputAudioState.encode(message.audio, writer.uint32(34).fork()).ldelim();
    }
    if (message.roomId !== '') {
      writer.uint32(42).string(message.roomId);
    }
    if (message.startedAt !== 0) {
      writer.uint32(56).int64(message.startedAt);
    }
    for (const v of message.tracks) {
      TrackInfo.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IngressState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIngressState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.int32() as any;
          break;
        case 2:
          message.error = reader.string();
          break;
        case 3:
          message.video = InputVideoState.decode(reader, reader.uint32());
          break;
        case 4:
          message.audio = InputAudioState.decode(reader, reader.uint32());
          break;
        case 5:
          message.roomId = reader.string();
          break;
        case 7:
          message.startedAt = longToNumber(reader.int64() as Long);
          break;
        case 6:
          message.tracks.push(TrackInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IngressState {
    return {
      status: isSet(object.status) ? ingressState_StatusFromJSON(object.status) : 0,
      error: isSet(object.error) ? String(object.error) : '',
      video: isSet(object.video) ? InputVideoState.fromJSON(object.video) : undefined,
      audio: isSet(object.audio) ? InputAudioState.fromJSON(object.audio) : undefined,
      roomId: isSet(object.roomId) ? String(object.roomId) : '',
      startedAt: isSet(object.startedAt) ? Number(object.startedAt) : 0,
      tracks: Array.isArray(object?.tracks)
        ? object.tracks.map((e: any) => TrackInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: IngressState): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = ingressState_StatusToJSON(message.status));
    message.error !== undefined && (obj.error = message.error);
    message.video !== undefined &&
      (obj.video = message.video ? InputVideoState.toJSON(message.video) : undefined);
    message.audio !== undefined &&
      (obj.audio = message.audio ? InputAudioState.toJSON(message.audio) : undefined);
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.startedAt !== undefined && (obj.startedAt = Math.round(message.startedAt));
    if (message.tracks) {
      obj.tracks = message.tracks.map((e) => (e ? TrackInfo.toJSON(e) : undefined));
    } else {
      obj.tracks = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IngressState>, I>>(object: I): IngressState {
    const message = createBaseIngressState();
    message.status = object.status ?? 0;
    message.error = object.error ?? '';
    message.video =
      object.video !== undefined && object.video !== null
        ? InputVideoState.fromPartial(object.video)
        : undefined;
    message.audio =
      object.audio !== undefined && object.audio !== null
        ? InputAudioState.fromPartial(object.audio)
        : undefined;
    message.roomId = object.roomId ?? '';
    message.startedAt = object.startedAt ?? 0;
    message.tracks = object.tracks?.map((e) => TrackInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseInputVideoState(): InputVideoState {
  return { mimeType: 0, width: 0, height: 0, framerate: 0 };
}

export const InputVideoState = {
  encode(message: InputVideoState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mimeType !== 0) {
      writer.uint32(8).uint32(message.mimeType);
    }
    if (message.width !== 0) {
      writer.uint32(24).uint32(message.width);
    }
    if (message.height !== 0) {
      writer.uint32(32).uint32(message.height);
    }
    if (message.framerate !== 0) {
      writer.uint32(40).uint32(message.framerate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InputVideoState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInputVideoState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mimeType = reader.uint32();
          break;
        case 3:
          message.width = reader.uint32();
          break;
        case 4:
          message.height = reader.uint32();
          break;
        case 5:
          message.framerate = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InputVideoState {
    return {
      mimeType: isSet(object.mimeType) ? Number(object.mimeType) : 0,
      width: isSet(object.width) ? Number(object.width) : 0,
      height: isSet(object.height) ? Number(object.height) : 0,
      framerate: isSet(object.framerate) ? Number(object.framerate) : 0,
    };
  },

  toJSON(message: InputVideoState): unknown {
    const obj: any = {};
    message.mimeType !== undefined && (obj.mimeType = Math.round(message.mimeType));
    message.width !== undefined && (obj.width = Math.round(message.width));
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.framerate !== undefined && (obj.framerate = Math.round(message.framerate));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InputVideoState>, I>>(object: I): InputVideoState {
    const message = createBaseInputVideoState();
    message.mimeType = object.mimeType ?? 0;
    message.width = object.width ?? 0;
    message.height = object.height ?? 0;
    message.framerate = object.framerate ?? 0;
    return message;
  },
};

function createBaseInputAudioState(): InputAudioState {
  return { mimeType: 0, channels: 0, sampleRate: 0 };
}

export const InputAudioState = {
  encode(message: InputAudioState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mimeType !== 0) {
      writer.uint32(8).uint32(message.mimeType);
    }
    if (message.channels !== 0) {
      writer.uint32(24).uint32(message.channels);
    }
    if (message.sampleRate !== 0) {
      writer.uint32(32).uint32(message.sampleRate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InputAudioState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInputAudioState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mimeType = reader.uint32();
          break;
        case 3:
          message.channels = reader.uint32();
          break;
        case 4:
          message.sampleRate = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InputAudioState {
    return {
      mimeType: isSet(object.mimeType) ? Number(object.mimeType) : 0,
      channels: isSet(object.channels) ? Number(object.channels) : 0,
      sampleRate: isSet(object.sampleRate) ? Number(object.sampleRate) : 0,
    };
  },

  toJSON(message: InputAudioState): unknown {
    const obj: any = {};
    message.mimeType !== undefined && (obj.mimeType = Math.round(message.mimeType));
    message.channels !== undefined && (obj.channels = Math.round(message.channels));
    message.sampleRate !== undefined && (obj.sampleRate = Math.round(message.sampleRate));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InputAudioState>, I>>(object: I): InputAudioState {
    const message = createBaseInputAudioState();
    message.mimeType = object.mimeType ?? 0;
    message.channels = object.channels ?? 0;
    message.sampleRate = object.sampleRate ?? 0;
    return message;
  },
};

function createBaseUpdateIngressRequest(): UpdateIngressRequest {
  return {
    ingressId: '',
    name: '',
    roomName: '',
    participantIdentity: '',
    participantName: '',
    audio: undefined,
    video: undefined,
  };
}

export const UpdateIngressRequest = {
  encode(message: UpdateIngressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ingressId !== '') {
      writer.uint32(10).string(message.ingressId);
    }
    if (message.name !== '') {
      writer.uint32(18).string(message.name);
    }
    if (message.roomName !== '') {
      writer.uint32(26).string(message.roomName);
    }
    if (message.participantIdentity !== '') {
      writer.uint32(34).string(message.participantIdentity);
    }
    if (message.participantName !== '') {
      writer.uint32(42).string(message.participantName);
    }
    if (message.audio !== undefined) {
      IngressAudioOptions.encode(message.audio, writer.uint32(50).fork()).ldelim();
    }
    if (message.video !== undefined) {
      IngressVideoOptions.encode(message.video, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateIngressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateIngressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ingressId = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.roomName = reader.string();
          break;
        case 4:
          message.participantIdentity = reader.string();
          break;
        case 5:
          message.participantName = reader.string();
          break;
        case 6:
          message.audio = IngressAudioOptions.decode(reader, reader.uint32());
          break;
        case 7:
          message.video = IngressVideoOptions.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateIngressRequest {
    return {
      ingressId: isSet(object.ingressId) ? String(object.ingressId) : '',
      name: isSet(object.name) ? String(object.name) : '',
      roomName: isSet(object.roomName) ? String(object.roomName) : '',
      participantIdentity: isSet(object.participantIdentity)
        ? String(object.participantIdentity)
        : '',
      participantName: isSet(object.participantName) ? String(object.participantName) : '',
      audio: isSet(object.audio) ? IngressAudioOptions.fromJSON(object.audio) : undefined,
      video: isSet(object.video) ? IngressVideoOptions.fromJSON(object.video) : undefined,
    };
  },

  toJSON(message: UpdateIngressRequest): unknown {
    const obj: any = {};
    message.ingressId !== undefined && (obj.ingressId = message.ingressId);
    message.name !== undefined && (obj.name = message.name);
    message.roomName !== undefined && (obj.roomName = message.roomName);
    message.participantIdentity !== undefined &&
      (obj.participantIdentity = message.participantIdentity);
    message.participantName !== undefined && (obj.participantName = message.participantName);
    message.audio !== undefined &&
      (obj.audio = message.audio ? IngressAudioOptions.toJSON(message.audio) : undefined);
    message.video !== undefined &&
      (obj.video = message.video ? IngressVideoOptions.toJSON(message.video) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateIngressRequest>, I>>(
    object: I,
  ): UpdateIngressRequest {
    const message = createBaseUpdateIngressRequest();
    message.ingressId = object.ingressId ?? '';
    message.name = object.name ?? '';
    message.roomName = object.roomName ?? '';
    message.participantIdentity = object.participantIdentity ?? '';
    message.participantName = object.participantName ?? '';
    message.audio =
      object.audio !== undefined && object.audio !== null
        ? IngressAudioOptions.fromPartial(object.audio)
        : undefined;
    message.video =
      object.video !== undefined && object.video !== null
        ? IngressVideoOptions.fromPartial(object.video)
        : undefined;
    return message;
  },
};

function createBaseListIngressRequest(): ListIngressRequest {
  return { roomName: '' };
}

export const ListIngressRequest = {
  encode(message: ListIngressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomName !== '') {
      writer.uint32(10).string(message.roomName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListIngressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListIngressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListIngressRequest {
    return {
      roomName: isSet(object.roomName) ? String(object.roomName) : '',
    };
  },

  toJSON(message: ListIngressRequest): unknown {
    const obj: any = {};
    message.roomName !== undefined && (obj.roomName = message.roomName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListIngressRequest>, I>>(object: I): ListIngressRequest {
    const message = createBaseListIngressRequest();
    message.roomName = object.roomName ?? '';
    return message;
  },
};

function createBaseListIngressResponse(): ListIngressResponse {
  return { items: [] };
}

export const ListIngressResponse = {
  encode(message: ListIngressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.items) {
      IngressInfo.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListIngressResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListIngressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.items.push(IngressInfo.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListIngressResponse {
    return {
      items: Array.isArray(object?.items)
        ? object.items.map((e: any) => IngressInfo.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ListIngressResponse): unknown {
    const obj: any = {};
    if (message.items) {
      obj.items = message.items.map((e) => (e ? IngressInfo.toJSON(e) : undefined));
    } else {
      obj.items = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ListIngressResponse>, I>>(
    object: I,
  ): ListIngressResponse {
    const message = createBaseListIngressResponse();
    message.items = object.items?.map((e) => IngressInfo.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDeleteIngressRequest(): DeleteIngressRequest {
  return { ingressId: '' };
}

export const DeleteIngressRequest = {
  encode(message: DeleteIngressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ingressId !== '') {
      writer.uint32(10).string(message.ingressId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteIngressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteIngressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ingressId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteIngressRequest {
    return {
      ingressId: isSet(object.ingressId) ? String(object.ingressId) : '',
    };
  },

  toJSON(message: DeleteIngressRequest): unknown {
    const obj: any = {};
    message.ingressId !== undefined && (obj.ingressId = message.ingressId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteIngressRequest>, I>>(
    object: I,
  ): DeleteIngressRequest {
    const message = createBaseDeleteIngressRequest();
    message.ingressId = object.ingressId ?? '';
    return message;
  },
};

export interface Ingress {
  /** Create a new Ingress */
  CreateIngress(request: CreateIngressRequest): Promise<IngressInfo>;
  /** Update an existing Ingress. Ingress can only be updated when it's in ENDPOINT_WAITING state. */
  UpdateIngress(request: UpdateIngressRequest): Promise<IngressInfo>;
  ListIngress(request: ListIngressRequest): Promise<ListIngressResponse>;
  DeleteIngress(request: DeleteIngressRequest): Promise<IngressInfo>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw 'Unable to locate global object';
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER');
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

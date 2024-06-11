// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import native from './native.cjs';

const {
  livekitInitialize,
  livekitCopyBuffer,
  livekitRetrievePtr,
  livekitFfiRequest,
  ffiHandleNew,
  ffiHandleDispose,
  ffiHandleHandle,
} = native;

class FfiHandle {
  constructor(handle) {
    this._handle = ffiHandleNew(handle);
  }

  dispose() {
    ffiHandleDispose(this._handle);
  }

  get handle() {
    return ffiHandleHandle(this._handle);
  }
}

export {
  livekitInitialize,
  livekitCopyBuffer,
  livekitRetrievePtr,
  livekitFfiRequest,
  FfiHandle,
}

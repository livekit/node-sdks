// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import type { LoadAudioFilterPluginResponse } from '@livekit/node-rtc-ffi-bindings';
import { LoadAudioFilterPluginRequest } from '@livekit/node-rtc-ffi-bindings';
import { FfiClient } from './ffi_client.js';

export class AudioFilter {
  constructor(moduleId: string, path: string, dependencies: string[] = []) {
    const req = new LoadAudioFilterPluginRequest({
      moduleId,
      pluginPath: path,
      dependencies,
    });

    const res = FfiClient.instance.request<LoadAudioFilterPluginResponse>({
      message: {
        case: 'loadAudioFilterPlugin',
        value: req,
      },
    });

    if (res.error) {
      throw new Error(`Failed to initialize audio filter: ${res.error}`);
    }
  }
}

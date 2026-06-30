// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
export interface ChatMessage {
  id: string;
  timestamp: number;
  message: string;
  editTimestamp?: number;
  generated?: boolean;
}

/**
 * Controls how the encoder degrades quality when bandwidth is constrained.
 */
export enum DegradationPreference {
  /** Balance between framerate and resolution degradation. */
  Balanced = 0,
  /** Degrade framerate to maintain resolution. */
  MaintainFramerate = 1,
  /** Degrade resolution to maintain framerate (drop frames to keep clarity). */
  MaintainResolution = 2,
  /**
   * Maintain both framerate and resolution. Frames may be dropped before encoding
   * if necessary to avoid overusing network and encoder resources.
   */
  MaintainFramerateAndResolution = 4,
}

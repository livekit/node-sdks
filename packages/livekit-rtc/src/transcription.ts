// SPDX-FileCopyrightText: 2024 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
export interface TranscriptionSegment {
  id: string;
  text: string;
  startTime: bigint;
  endTime: bigint;
  language: string;
  final: boolean;
}

export interface Transcription {
  participantIdentity: string;
  trackSid: string;
  segments: TranscriptionSegment[];
}

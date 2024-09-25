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

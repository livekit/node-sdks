export interface TranscriptionSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  language: string;
  final: boolean;
}

export interface Transcription {
  participantIdentity: string;
  trackSid: string;
  segments: TranscriptionSegment[];
}

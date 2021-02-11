export interface VideoGrant {
  roomCreate?: boolean;
  roomJoin?: boolean;
  roomList?: boolean;
  roomAdmin?: boolean;
  room?: string;
}

export interface ClaimGrants {
  video?: VideoGrant;
  metadata?: object;
}

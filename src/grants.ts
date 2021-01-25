export interface VideoGrant {
  roomCreate?: boolean;
  roomJoin?: boolean;
  roomList?: boolean;
  room?: string;
}

export interface ClaimGrants {
  video?: VideoGrant;
}

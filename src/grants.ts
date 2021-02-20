export interface VideoGrant {
  /** permission to create a room */
  roomCreate?: boolean;

  /** permission to join a room as a participant, room must be set */
  roomJoin?: boolean;

  /** permission to list rooms */
  roomList?: boolean;

  /** permission to control a specific room, room must be set */
  roomAdmin?: boolean;

  /** name of the room, must be set for admin or join permissions */
  room?: string;
}

/** @internal */
export interface ClaimGrants {
  video?: VideoGrant;
  metadata?: object;
}

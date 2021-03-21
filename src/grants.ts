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

  /**
   * allow participant to publish. If neither canPublish or canSubscribe is set,
   * both publish and subscribe are enabled
   */
  canPublish?: boolean;

  /** allow participant to subscribe to other tracks */
  canSubscribe?: boolean;
}

/** @internal */
export interface ClaimGrants {
  video?: VideoGrant;
  metadata?: string;
}

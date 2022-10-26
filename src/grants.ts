export interface VideoGrant {
  /** permission to create a room */
  roomCreate?: boolean;

  /** permission to join a room as a participant, room must be set */
  roomJoin?: boolean;

  /** permission to list rooms */
  roomList?: boolean;

  /** permission to start a recording */
  roomRecord?: boolean;

  /** permission to control a specific room, room must be set */
  roomAdmin?: boolean;

  /** name of the room, must be set for admin or join permissions */
  room?: string;

  /** permissions to control ingress, not specific to any room or ingress */
  ingressAdmin?: boolean;

  /**
   * allow participant to publish. If neither canPublish or canSubscribe is set,
   * both publish and subscribe are enabled
   */
  canPublish?: boolean;

  /** allow participant to subscribe to other tracks */
  canSubscribe?: boolean;

  /**
   * allow participants to publish data, defaults to true if not set
   */
  canPublishData?: boolean;

  /** participant isn't visible to others */
  hidden?: boolean;

  /** participant is recording the room, when set, allows room to indicate it's being recorded */
  recorder?: boolean;
}

/** @internal */
export interface ClaimGrants {
  name?: string;
  video?: VideoGrant;
  metadata?: string;
  sha256?: string;
}

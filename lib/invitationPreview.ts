import type { Invitation, MusicTrack } from "./types";

export const PREVIEW_READY = "oila:invitation-preview:ready";
export const PREVIEW_UPDATE = "oila:invitation-preview:update";
export const PREVIEW_RESTART = "oila:invitation-preview:restart";

export interface InvitationPreviewPayload {
  invitation: Invitation;
  musicTrack: MusicTrack | null;
}

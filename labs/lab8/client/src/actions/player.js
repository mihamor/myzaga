export const SET_TRACK_TO_PLAYER = 'SET_TRACK_TO_PLAYER';
export function setTrack(track) {
  return {
    type: SET_TRACK_TO_PLAYER,
    track,
  }
}

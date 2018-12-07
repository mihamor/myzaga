import {
   SET_TRACK_TO_PLAYER
} from '../actions/player';

const initialState = {
    trackOnPlay : null,
};

function setPlayer(state = initialState, action) {
  switch (action.type) {
    case SET_TRACK_TO_PLAYER:
      return Object.assign({}, state, {
        trackOnPlay: action.track,
      })
    default:
      return state;
  }
}


function combinedReducer(state = initialState, action){
  switch (action.type) {
    case SET_TRACK_TO_PLAYER:
      return setPlayer(state, action);
    default:
      return state;
  }
}
export default combinedReducer;
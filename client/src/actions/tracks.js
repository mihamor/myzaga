import TracksApi from "../Api/TrackApi";


export const GET_TRACKS = 'GET_TRACKS';
export function requestTracks(page, search_str) {
  return {
    type: GET_TRACKS,
    page,
    searchFilter : search_str,
    isFetching : true,
  }
}

export const GET_TRACKS_RESULT = 'GET_TRACKS_RESULT';
export function receiveTracks(err,tracks, page_count, curr_page) {
  return {
    type: GET_TRACKS_RESULT,
    tracks,
    err,
    currentPage: curr_page,
    pageCount : page_count,
    isFetching : false,
  }
}

export const GET_TRACK_BY_ID = 'GET_TRACK_BY_ID';
export function requestTrack(id) {
  return {
    type: GET_TRACK_BY_ID,
    id,
    isFetching : true,
  }
}

export const GET_TRACK_BY_ID_RESULT = 'GET_TRACK_BY_ID_RESULT';
export function receiveTrack(track, err) {
  return {
    type: GET_TRACK_BY_ID_RESULT,
    track,
    err,
    isFetching : false,
  }
}


export const SET_TRACK_ON_VIEW = 'SET_TRACK_ON_VIEW';
export function setTrackOnView(track) {
  return {
    type: SET_TRACK_ON_VIEW,
    track,
    isFetching : false,
  }
}


export const UPDATE_TRACK = 'UPDATE_TRACK';
export function requestUpdTrack(track) {
  return {
    type: UPDATE_TRACK,
    track,
    isUpdated: false,
    isFetching : true,
  }
}

export const UPDATE_TRACK_RESULT = 'UPDATE_TRACK_RESULT';
export function receiveUpdTrack(newTrack, err) {
  return {
    type: UPDATE_TRACK_RESULT,
    newTrack,
    err,
    isUpdated : !err,
    isFetching : false,
  }
}

export const CREATE_TRACK = 'CREATE_TRACK';
export function requestCreateTrack(formData) {
  return {
    type: CREATE_TRACK,
    formData,
    isFetching : true,
  }
}

export const CREATE_TRACK_RESULT = 'CREATE_TRACK_RESULT';
export function receiveCreateTrack(newTrack, err) {
  return {
    type: CREATE_TRACK_RESULT,
    newTrack,
    err,
    isFetching : false,
  }
}



export const DELETE_TRACK = 'DELETE_TRACK';
export function requestDeleteTrack(id) {
  return {
    type: DELETE_TRACK,
    id,
    isFetching : true,
  }
}

export const DELETE_TRACK_RESULT = 'DELETE_TRACK_RESULT';
export function receiveDeleteTrack(oldTrack, err) {
  return {
    type: DELETE_TRACK_RESULT,
    oldTrack,
    err,
    isFetching : false,
  }
}







export function fetchTracks(page, search_str) {
  return function (dispatch) {
    dispatch(requestTracks(page, search_str));
    return TracksApi.getTracks(page, search_str)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {tracks , page_count, this_page} = res.tracks;
        return dispatch(receiveTracks(res.err, tracks,page_count, this_page))
      }).catch(err =>
        dispatch(receiveTracks(err, null))
      );
  }
}

export function fetchTracksAll() {
  return function (dispatch) {
    dispatch(requestTracks(0, ""));
    return TracksApi.getAllTracks()
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let tracks = res.tracks;
        return dispatch(receiveTracks(res.err, tracks, 0, 0))
      }).catch(err =>
        dispatch(receiveTracks(err, null))
      );
  }
}



export function fetchTrackById(id) {
  return function (dispatch) {
    dispatch(requestTrack(id));
    return TracksApi.getById(id)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {track, err} = res;
        return dispatch(receiveTrack(track, err))
      }).catch(err =>
        dispatch(receiveTrack(null, err))
      );
  }
}


export function fetchUpdateTrack(track) {
  return function (dispatch) {
    dispatch(requestUpdTrack(track));
    return TracksApi.updateTrack(track)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {oldTrack, err} = res;
        return dispatch(receiveUpdTrack(track, err))
      }).catch(err =>
        dispatch(receiveUpdTrack(null, err))
      );
  }
}

export function fetchCreateTrack(formData) {
  return function (dispatch) {
    dispatch(requestCreateTrack(formData));
    return TracksApi.newTrack(formData)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {newTrack, err} = res;
        return dispatch(receiveCreateTrack(newTrack, err))
      }).catch(err =>
        dispatch(receiveCreateTrack(null, err))
      );
  }
}


export function fetchDeleteTrack(id) {
  return function (dispatch) {
    dispatch(requestDeleteTrack(id));
    return TracksApi.deleteTrack(id)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {oldTrack, err} = res;
        return dispatch(receiveDeleteTrack(oldTrack, err))
      }).catch(err =>
        dispatch(receiveDeleteTrack(null, err))
      );
  }
}


import PlaylistApi from "../Api/PlaylistApi";


export const GET_PLAYLISTS = 'GET_PLAYLISTS';
export function requestPlaylists(page, search_str, user) {
  return {
    type: GET_PLAYLISTS,
    page,
    user,
    searchFilter : search_str,
    isFetching : true,
  }
}

export const GET_PLAYLISTS_RESULT = 'GET_PLAYLISTS_RESULT';
export function receivePlaylists(err,playlists, page_count, curr_page) {
  return {
    type: GET_PLAYLISTS_RESULT,
    playlists,
    err,
    currentPage: curr_page,
    pageCount : page_count,
    isFetching : false,
  }
}

export const GET_PLAYLIST_BY_ID = 'GET_PLAYLIST_BY_ID';
export function requestPlaylist(id) {
  return {
    type: GET_PLAYLIST_BY_ID,
    id,
    isFetching : true,
  }
}

export const GET_PLAYLIST_BY_ID_RESULT = 'GET_PLAYLIST_BY_ID_RESULT';
export function receivePlaylist(playlist, err) {
  return {
    type: GET_PLAYLIST_BY_ID_RESULT,
    playlist,
    err,
    isFetching : false,
  }
}


export const GET_UPDATE_DATA = 'GET_UPDATE_DATA';
export function requestUpdateData(id) {
  return {
    type: GET_UPDATE_DATA,
    id,
    isFetching : true,
  }
}

export const GET_UPDATE_DATA_RESULT = 'GET_UPDATE_DATA_RESULT';
export function receiveUpdateData(data, err) {
  return {
    type: GET_UPDATE_DATA_RESULT,
    data,
    err,
    isFetching : false,
  }
}



export const SET_PLAYLIST_ON_VIEW = 'SET_PLAYLIST_ON_VIEW';
export function setPlaylistOnView(playlist) {
  return {
    type: SET_PLAYLIST_ON_VIEW,
    playlist,
    isFetching : false,
  }
}


export const UPDATE_PLAYLIST = 'UPDATE_PLAYLIST';
export function requestUpdPlaylist(playlist) {
  return {
    type: UPDATE_PLAYLIST,
    playlist,
    isUpdated: false,
    isFetching : true,
  }
}

export const UPDATE_PLAYLIST_RESULT = 'UPDATE_PLAYLIST_RESULT';
export function receiveUpdPlaylist(oldPlaylist, err) {
  return {
    type: UPDATE_PLAYLIST_RESULT,
    oldPlaylist,
    err,
    isUpdated : !err,
    isFetching : false,
  }
}

export const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
export function requestCreatePlaylist(playlist) {
  return {
    type: CREATE_PLAYLIST,
    playlist,
    isFetching : true,
  }
}

export const CREATE_PLAYLIST_RESULT = 'CREATE_PLAYLIST_RESULT';
export function receiveCreatePlaylist(newPlaylist, err) {
  return {
    type: CREATE_PLAYLIST_RESULT,
    newPlaylist,
    err,
    isFetching : false,
  }
}



export const DELETE_PLAYLIST = 'DELETE_PLAYLIST';
export function requestDeletePlaylist(id) {
  return {
    type: DELETE_PLAYLIST,
    id,
    isFetching : true,
  }
}

export const DELETE_PLAYLIST_RESULT = 'DELETE_PLAYLIST_RESULT';
export function receiveDeletePlaylist(oldPlaylist, err) {
  return {
    type: DELETE_PLAYLIST_RESULT,
    oldPlaylist,
    err,
    isFetching : false,
  }
}


export function fetchPlaylists(page, search_str, user) {
  return function (dispatch) {
    dispatch(requestPlaylists(page, search_str, user));
    return PlaylistApi.getPlaylists(page, search_str, user)
      .then(res => {
        //console.log("RESULT");
        //console.log(res);
        let {playlists , page_count, this_page} = res.playlists;
        return dispatch(receivePlaylists(res.err, playlists,page_count, this_page))
      }).catch(err =>
        dispatch(receivePlaylists(err, null))
      );
  }
}

export function fetchPlaylistById(id) {
  return function (dispatch) {
    dispatch(requestPlaylist(id));
    return PlaylistApi.getById(id)
      .then(res => {
        //console.log("RESULT");
        //console.log(res);
        let {playlist, err} = res;
        return dispatch(receivePlaylist(playlist, err))
      }).catch(err =>
        dispatch(receivePlaylist(null, err))
      );
  }
}

export function fetchUpdateData(id) {
    return function (dispatch) {
      dispatch(requestUpdateData(id));
      return PlaylistApi.getUpdateData(id)
        .then(res => {
          //console.log("RESULT");
          //console.log(res);
          let {data, err} = res;
          return dispatch(receiveUpdateData(data, err))
        }).catch(err =>
          dispatch(receiveUpdateData(null, err))
        );
    }
  }


export function fetchUpdatePlaylist(playlist) {
  return function (dispatch) {
    dispatch(requestUpdPlaylist(playlist));
    return PlaylistApi.updatePlaylist(playlist)
      .then(res  => {
        //console.log("RESULT");
        //console.log(res);
        let {oldPlaylist, err} = res;
        return dispatch(receiveUpdPlaylist(playlist, err))
      }).catch(err =>
        dispatch(receiveUpdPlaylist(null, err))
      );
  }
}

export function fetchCreatePlaylist(playlist) {
  return function (dispatch) {
    dispatch(requestCreatePlaylist(playlist));
    return PlaylistApi.newPlaylist(playlist)
      .then(res => {
        //console.log("RESULT");
        //console.log(res);
        let {newPlaylist, err} = res;
        return dispatch(receiveCreatePlaylist(newPlaylist, err))
      }).catch(err =>
        dispatch(receiveCreatePlaylist(null, err))
      );
  }
}


export function fetchDeletePlaylist(id) {
  return function (dispatch) {
    dispatch(requestDeletePlaylist(id));
    return PlaylistApi.deletePlaylist(id)
      .then(res => {
        //console.log("RESULT");
        //console.log(res);
        let {oldPlaylist, err} = res;
        return dispatch(receiveDeletePlaylist(oldPlaylist, err))
      }).catch(err =>
        dispatch(receiveDeletePlaylist(null, err))
      );
  }
}


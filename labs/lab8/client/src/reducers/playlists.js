import {
    GET_PLAYLISTS, GET_PLAYLISTS_RESULT,
    GET_PLAYLIST_BY_ID, GET_PLAYLIST_BY_ID_RESULT,
    SET_PLAYLIST_ON_VIEW, UPDATE_PLAYLIST,
    UPDATE_PLAYLIST_RESULT, CREATE_PLAYLIST,
    CREATE_PLAYLIST_RESULT, DELETE_PLAYLIST,
    DELETE_PLAYLIST_RESULT, GET_UPDATE_DATA,
    GET_UPDATE_DATA_RESULT
} from '../actions/playlists'



// {
//   loggedInUser: null,
//   isFetchingLogin: false,
// }


const initialState = {
    playlistsOnPage: [],
    errorOnFetch: null,
    currentPage: 0,
    searchFilter: '',
    userFilter: '',
    isFetchingPlaylists: false,
    pageCount: 0,


    updateData: {
        tracks: null,
        playlist: null
    },


    playlistOnView: null,
    playlistOnViewId: null,
    isFetchingPlaylist: false,
    errorOnFetchPlaylist: null,


    isFetchingPlaylistUpdate: false,
    isPlaylistUpdated: false,
    
    isFetchingPlaylistCreate: false,
    errOnCreatePlaylist: null,
    newPlaylistId: null,
    isPlaylistCreated: false,

    isFetchingPlaylistDelete: false,
    errOnDeletePlaylist: null,
    deletedPlaylist: null,

};

function getPlaylists(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYLISTS:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isFetchingPlaylistCreate: false,
        isPlaylistDeleted: false,
        isFetchingPlaylists: action.isFetching,
        currentPage: action.page,
        userFilter: action.user,
        searchFilter : action.searchFilter,

      })
    case GET_PLAYLISTS_RESULT:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isFetchingPlaylistCreate: false,
        isPlaylistDeleted: false,
        playlistsOnPage: action.playlists,
        errorOnFetch: action.err,
        pageCount: action.pageCount,
        currentPage : action.currentPage,
        isFetchingPlaylists: action.isFetching
      })
    default:
      return state;
  }
}

function getPlaylistById(state = initialState, action) {
  switch (action.type) {
    case GET_PLAYLIST_BY_ID:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isFetchingPlaylistCreate: false,
        isPlaylistDeleted: false,
        isFetchingPlaylist: action.isFetching,
        playlistOnViewId: action.id,
      })
    case GET_PLAYLIST_BY_ID_RESULT:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isFetchingPlaylistCreate: false,
        isPlaylistDeleted: false,
        playlistOnView: action.playlist,
        errorOnFetchPlaylist: action.err,
        isFetchingPlaylist: action.isFetching
      })
    case SET_PLAYLIST_ON_VIEW:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isPlaylistDeleted: false,
        isFetchingPlaylistCreate: false,
        playlistOnView: action.playlist,
        isFetchingPlaylist: action.isFetching
      })
    case GET_UPDATE_DATA:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isPlaylistDeleted: false,
        isFetchingPlaylistCreate: false,
        isFetchingPlaylist: action.isFetching
      })
    case GET_UPDATE_DATA_RESULT:
      return Object.assign({}, state, {
        isPlaylistUpdated: false,
        isPlaylistDeleted: false,
        isFetchingPlaylistCreate: false,
        updateData: action.data,
        isFetchingPlaylist: action.isFetching
    })

    default:
      return state;
  }
}


function updatePlaylist(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PLAYLIST:
      return Object.assign({}, state, {
        isPlaylistUpdated : action.isUpdated,
        isFetchingPlaylistCreate: false,
        isFetchingPlaylistUpdate: action.isFetching,
      })
    case UPDATE_PLAYLIST_RESULT:{
      return Object.assign({}, state, {
        playlistOnView: null, //needs to refetch
        errorOnFetchPlaylist: action.err,
        isFetchingPlaylistCreate: false,
        isPlaylistUpdated : action.isUpdated,
        isFetchingPlaylistUpdate: action.isFetching
      })
    }
    default:
      return state;
  }
}

function createPlaylist(state = initialState, action) {
  switch (action.type) {
    case CREATE_PLAYLIST:
      return Object.assign({}, state, {
        isFetchingPlaylistCreate: action.isFetching,
      })
    case CREATE_PLAYLIST_RESULT:{
      return Object.assign({}, state, {
        playlistOnView: action.newPlaylist, //needs to refetch
        newPlaylistId : action.newPlaylist._id,
        errOnCreatePlaylist: action.err,
        isPlaylistCreated : action.newPlaylist ? true : false,
        isFetchingPlaylistCreate: action.isFetching
      })
    }
    default:
      return state;
  }
}


function deletePlaylist(state = initialState, action) {
  switch (action.type) {
    case DELETE_PLAYLIST:
      return Object.assign({}, state, {
        isFetchingPlaylistDelete: action.isFetching,
        isPlaylistDeleted: false
      })
    case DELETE_PLAYLIST_RESULT:{
      return Object.assign({}, state, {
        deletedPlaylist: action.oldPlaylist, //needs to refetch
        errOnDeletePlaylist: action.err,
        isPlaylistDeleted: action.oldPlaylist ? true : false,
        isFetchingPlaylistDelete: action.isFetching
      })
    }
    default:
      return state;
  }
}



function combinedReducer(state = initialState, action){
  switch (action.type) {
    case GET_PLAYLISTS:
    case GET_PLAYLISTS_RESULT:
      return getPlaylists(state, action);
    case GET_PLAYLIST_BY_ID:
    case GET_PLAYLIST_BY_ID_RESULT:
    case GET_UPDATE_DATA:
    case GET_UPDATE_DATA_RESULT:
      return getPlaylistById(state, action);
    case UPDATE_PLAYLIST:
    case UPDATE_PLAYLIST_RESULT:
      return updatePlaylist(state, action);
    case CREATE_PLAYLIST:
    case CREATE_PLAYLIST_RESULT:
      return createPlaylist(state, action);
    case DELETE_PLAYLIST:
    case DELETE_PLAYLIST_RESULT:
      return deletePlaylist(state, action);
  
    default:
      return state;
  }
}
export default combinedReducer;
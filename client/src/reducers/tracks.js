import {
    GET_TRACKS, GET_TRACKS_RESULT,
    GET_TRACK_BY_ID, GET_TRACK_BY_ID_RESULT,
    SET_TRACK_ON_VIEW, UPDATE_TRACK,
    UPDATE_TRACK_RESULT, CREATE_TRACK,
    CREATE_TRACK_RESULT, DELETE_TRACK,
    DELETE_TRACK_RESULT
} from '../actions/tracks'
import {
  CREATE_COMMENT, CREATE_COMMENT_RESULT,
  DELETE_COMMENT, DELETE_COMMENT_RESULT
} from '../actions/comments'

// {
//   loggedInUser: null,
//   isFetchingLogin: false,
// }


const initialState = {
    tracksOnPage: [],
    errorOnFetch: null,
    currentPage: 0,
    searchFilter: '',
    isFetchingTracks: false,
    pageCount: 0,


    trackOnView: null,
    trackOnViewId: null,
    isFetchingTrack: false,
    errorOnFetchTrack: null,


    isFetchingTrackUpdate: false,
    isTrackUpdated: false,
    
    isFetchingTrackCreate: false,
    errOnCreateTrack: null,
    isTrackCreated: false,


    isFetchingTrackDelete: false,
    errOnDeleteTrack: null,
    deletedTrack: null,

    isFetchingDeleteComment: false,
    isDeletedComment: false,
    errOnDeleteComment : null,


    isFetchingCreateComment: false,
    isCreatedComment: false,
    errOnCreateComment : null,
    newComment : null,
};

function getTracks(state = initialState, action) {
  switch (action.type) {
    case GET_TRACKS:
      return Object.assign({}, state, {
        isTrackUpdated: false,
        isDeletedComment : false,
        isTrackCreated: false,
        isCreatedComment: false,
        isTrackDeleted: false,
        isFetchingTracks: action.isFetching,
        currentPage: action.page,
        searchFilter : action.searchFilter,
      })
    case GET_TRACKS_RESULT:
      return Object.assign({}, state, {
        isTrackUpdated: false,
        isDeletedComment : false,
        isTrackCreated: false,
        isTrackDeleted: false,
        isCreatedComment: false,
        tracksOnPage: action.tracks,
        errorOnFetch: action.err,
        pageCount: action.pageCount,
        currentPage : action.currentPage,
        isFetchingTracks: action.isFetching
      })
    default:
      return state;
  }
}

function getTrackById(state = initialState, action) {
  switch (action.type) {
    case GET_TRACK_BY_ID:
      return Object.assign({}, state, {
        isTrackUpdated: false,
        isDeletedComment : false,
        isTrackCreated: false,
        isTrackDeleted: false,
        isCreatedComment: false,
        isFetchingTrack: action.isFetching,
        trackOnViewId: action.id,
      })
    case GET_TRACK_BY_ID_RESULT:
      return Object.assign({}, state, {
        isTrackUpdated: false,
        isTrackDeleted: false,
        isTrackCreated: false,
        isDeletedComment : false,
        isCreatedComment: false,
        trackOnView: action.track,
        errorOnFetchTrack: action.err,
        isFetchingTrack: action.isFetching
      })
    case SET_TRACK_ON_VIEW:
      return Object.assign({}, state, {
        isTrackUpdated: false,
        isCreatedComment: false,
        isDeletedComment : false,
        isTrackDeleted: false,
        isTrackCreated: false,
        trackOnView: action.track,
        isFetchingTrack: action.isFetching
      })
    default:
      return state;
  }
}


function updateTrack(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TRACK:
      return Object.assign({}, state, {
        isTrackUpdated : action.isUpdated,
        isFetchingTrackUpdate: action.isFetching,
      })
    case UPDATE_TRACK_RESULT:{
      return Object.assign({}, state, {
        trackOnView: null, //needs to refetch

        errorOnFetchTrack: action.err,
        isTrackUpdated : action.isUpdated,
        isFetchingTrackUpdate: action.isFetching
      })
    }
    default:
      return state;
  }
}

function createTrack(state = initialState, action) {
  switch (action.type) {
    case CREATE_TRACK:
      return Object.assign({}, state, {
        trackOnView: null,
        isFetchingTrackCreate: action.isFetching,
      })
    case CREATE_TRACK_RESULT:{
      return Object.assign({}, state, {
       // trackOnView: action.newTrack, //needs to refetch
        isTrackCreated: action.newTrack,
        errOnCreateTrack: action.err,
        isFetchingTrackCreate: action.isFetching
      })
    }
    default:
      return state;
  }
}


function deleteTrack(state = initialState, action) {
  switch (action.type) {
    case DELETE_TRACK:
      return Object.assign({}, state, {
        isFetchingTrackDelete: action.isFetching,
        isTrackDeleted: false
      })
    case DELETE_TRACK_RESULT:{
      return Object.assign({}, state, {
        deletedTrack: action.oldTrack, //needs to refetch
        errOnDeleteTrack: action.err,
        isTrackDeleted: action.oldTrack ? true : false,
        isFetchingTrackDelete: action.isFetching
      })
    }
    default:
      return state;
  }
}


function createComment(state = initialState, action) {
  switch (action.type) {
    case CREATE_COMMENT:
      return Object.assign({}, state, {
        isDeletedComment : false,
        isCreatedComment : false,
        isFetchingCreateComment: action.isFetching,
      })
    case CREATE_COMMENT_RESULT:{
      return Object.assign({}, state, {
        newComment: action.newComment,
        errOnCreateComment: action.err,
        isCreatedComment : action.newComment ? true : false,
        isFetchingCreateComment: action.isFetching
      })
    }
    default:
      return state;
  }
}


function deleteComment(state = initialState, action) {
  switch (action.type) {
    case DELETE_COMMENT:
      return Object.assign({}, state, {
        isFetchingDeleteComment: action.isFetching,
        isCreatedComment: false,
        isDeletedComment: false
      })
    case DELETE_COMMENT_RESULT:{
      return Object.assign({}, state, {
        errOnDeleteComment: action.err,
        isDeletedComment: action.oldComment ? true : false,
        isFetchingDeleteComment: action.isFetching
      })
    }
    default:
      return state;
  }
}



function combinedReducer(state = initialState, action){
  switch (action.type) {
    case GET_TRACKS:
    case GET_TRACKS_RESULT:
      return getTracks(state, action);
    case GET_TRACK_BY_ID:
    case GET_TRACK_BY_ID_RESULT:
      return getTrackById(state, action);
    case UPDATE_TRACK:
    case UPDATE_TRACK_RESULT:
      return updateTrack(state, action);
    case CREATE_TRACK:
    case CREATE_TRACK_RESULT:
      return createTrack(state, action);
    case DELETE_TRACK:
    case DELETE_TRACK_RESULT:
      return deleteTrack(state, action);
    case CREATE_COMMENT:
    case CREATE_COMMENT_RESULT:
      return createComment(state, action);
    case DELETE_COMMENT:
    case DELETE_COMMENT_RESULT:
      return deleteComment(state, action);
  
    default:
      return state;
  }
}
export default combinedReducer;
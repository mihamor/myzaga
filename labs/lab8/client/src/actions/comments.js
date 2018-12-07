import CommentApi from "../Api/CommentApi";



export const CREATE_COMMENT = 'CREATE_COMMENT';
export function requestCreateComment(comment, track_id) {
  return {
    type: CREATE_COMMENT,
    comment,
    track_id,
    isFetching : true,
  }
}

export const CREATE_COMMENT_RESULT = 'CREATE_COMMENT_RESULT';
export function receiveCreateComment(newComment, err) {
  return {
    type: CREATE_COMMENT_RESULT,
    newComment,
    err,
    isFetching : false,
  }
}



export const DELETE_COMMENT = 'DELETE_COMMENT';
export function requestDeleteComment(id, track_id) {
  return {
    type: DELETE_COMMENT,
    id,
    track_id,
    isFetching : true,
  }
}

export const DELETE_COMMENT_RESULT = 'DELETE_COMMENT_RESULT';
export function receiveDeleteComment(oldComment, err) {
  return {
    type: DELETE_COMMENT_RESULT,
    oldComment,
    err,
    isFetching : false,
  }
}

export function fetchCreateComment(comment, track_id) {
  return function (dispatch) {
    dispatch(requestCreateComment(comment, track_id));
    return CommentApi.newComment(comment, track_id)
      .then(res => {
        //console.log("RESULT");
        //console.log(res);
        let {newComment, err} = res;
        return dispatch(receiveCreateComment(newComment, err))
      }).catch(err =>
        dispatch(receiveCreateComment(null, err))
      );
  }
}


export function fetchDeleteComment(id, track_id) {
  return function (dispatch) {
    dispatch(requestDeleteComment(id, track_id));
    return CommentApi.deleteComment(id, track_id)
      .then(res => {
        //console.log("RESULT");
        //console.log(res);
        let {oldComment, err} = res;
        return dispatch(receiveDeleteComment(oldComment, err))
      }).catch(err =>
        dispatch(receiveDeleteComment(null, err))
      );
  }
}


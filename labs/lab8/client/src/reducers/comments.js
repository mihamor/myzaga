import {
    CREATE_COMMENT, CREATE_COMMENT_RESULT,
    DELETE_COMMENT, DELETE_COMMENT_RESULT
} from '../actions/comments'



// {
//   loggedInUser: null,
//   isFetchingLogin: false,
// }


const initialState = {
    isFetchingDeleteComment: false,
    isDeletedComment: false,
    errOnDeleteComment : null,


    isFetchingCreateComment: false,
    isCreatedComment: false,
    errOnCreateComment : null,
    newComment : null,
};


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
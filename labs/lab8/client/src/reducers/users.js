import {
    GET_USERS, GET_USERS_RESULT,
   GET_USER_BY_ID, GET_USER_BY_ID_RESULT,
   SET_USER_ON_VIEW,
    UPDATE_USER,
    UPDATE_USER_RESULT,
} from '../actions/users'



// {
//   loggedInUser: null,
//   isFetchingLogin: false,
// }


const initialState = {
    usersOnPage: [],
    errorOnFetch: null,
    currentPage: 0,
    searchFilter: '',
    isFetchingUsers: false,
    pageCount: 0,


    userOnView: null,
    userOnViewId: null,
    isFetchingUser: false,
    errorOnFetchUser: null,


    isFetchingUserUpdate: false,
    isUserUpdated: false,
};

function getUsers(state = initialState, action) {
  switch (action.type) {
    case GET_USERS:
      return Object.assign({}, state, {
        isUserUpdated: false,
        isFetchingUsers: action.isFetching,
        currentPage: action.page,
        searchFilter : action.searchFilter,
      })
    case GET_USERS_RESULT:
      return Object.assign({}, state, {
        isUserUpdated: false,
        usersOnPage: action.users,
        errorOnFetch: action.err,
        pageCount: action.pageCount,
        currentPage : action.currentPage,
        isFetchingUsers: action.isFetching
      })
    default:
      return state;
  }
}


function getUserById(state = initialState, action) {
  switch (action.type) {
    case GET_USER_BY_ID:
      return Object.assign({}, state, {
        isUserUpdated: false,
        isFetchingUser: action.isFetching,
        userOnViewId: action.id,
      })
    case GET_USER_BY_ID_RESULT:
      return Object.assign({}, state, {
        isUserUpdated: false,
        userOnView: action.user,
        errorOnFetchUser: action.err,
        isFetchingUser: action.isFetching
      })
    case SET_USER_ON_VIEW:
      return Object.assign({}, state, {
        isUserUpdated: false,
        userOnView: action.user,
        isFetchingUser: action.isFetching
      })
    default:
      return state;
  }
}


function updateUser(state = initialState, action) {
  switch (action.type) {
    case UPDATE_USER:
      return Object.assign({}, state, {
        isUserUpdated : action.isUpdated,
        isFetchingUserUpdate: action.isFetching,
      })
    case UPDATE_USER_RESULT:{
      return Object.assign({}, state, {
        userOnView: null, //needs to refetch
        errorOnFetchUser: action.err,
        isUserUpdated : action.isUpdated,
        isFetchingUserUpdate: action.isFetching
      })
    }
    default:
      return state;
  }
}



function combinedReducer(state = initialState, action){
  switch (action.type) {
    case GET_USERS:
    case GET_USERS_RESULT:
      return getUsers(state, action);
    case GET_USER_BY_ID:
    case GET_USER_BY_ID_RESULT:
    case SET_USER_ON_VIEW:
       return getUserById(state, action);
    case UPDATE_USER:
    case UPDATE_USER_RESULT:
       return updateUser(state, action);
  
    default:
      return state;
  }
}
export default combinedReducer;
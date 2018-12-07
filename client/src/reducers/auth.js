import {
    USER_LOGIN, RECEIVE_LOGIN_RESULT,
    RESULT_INITIAL_AUTH, INITIAL_AUTH,
    LOGOUT_USER, USER_REGISTER,
    USER_REGISTER_RESPONSE,
} from '../actions/auth'



// {
//   loggedInUser: null,
//   isFetchingLogin: false,
// }


const initialState = {
    loggedInUser: null,
    registerErr: null,
    loginErr : null,
    isFetchingLogin: false,
    isFetchingAuth: false,
    isFetchingRegister: false,
    isRegistered: false,
};

function login(state = initialState, action) {
  switch (action.type) {
    case USER_LOGIN:
      return Object.assign({}, state, {
        isFetchingLogin: true,
        loginErr : null,
      })
    case RECEIVE_LOGIN_RESULT:
      return Object.assign({}, state, {
        loggedInUser: action.user,
        loginErr: action.err,
        isFetchingLogin: false
      })
    case LOGOUT_USER:
      return Object.assign({}, state, {
        loggedInUser: action.user,
      })
    default:
      return state;
  }
}

function register(state = initialState, action) {
  switch (action.type) {
    case USER_REGISTER:
      return Object.assign({}, state, {
        isFetchingRegister: true,
      })
    case USER_REGISTER_RESPONSE:
      return Object.assign({}, state, {
        //loggedInUser: action.user,
        isRegistered : action.err ? false : true,
        registerErr: action.err,
        isFetchingRegister: false
      })
    default:
      return state;
  }
}








function auth(state = initialState, action) {
  switch (action.type) {
    case INITIAL_AUTH:
      return Object.assign({}, state, {
        isFetchingAuth: true,
      })
    case RESULT_INITIAL_AUTH:
      return Object.assign({}, state, {
        loggedInUser: action.user,
        loginErr: action.err,
        isFetchingAuth: false
      })
    default:
      return state;
  }
}

function combinedReducer(state = initialState, action){
  switch (action.type) {
    case INITIAL_AUTH:
    case RESULT_INITIAL_AUTH:
      return auth(state, action);
    case USER_LOGIN:
    case LOGOUT_USER:
    case RECEIVE_LOGIN_RESULT:
      return login(state, action);
    case USER_REGISTER:
    case USER_REGISTER_RESPONSE:
      return register(state, action);
    default:
      return state;
  }
}
export default combinedReducer;
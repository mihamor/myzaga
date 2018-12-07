import AuthApi from "../Api/AuthApi";
import UserApi from "../Api/UserApi";


export const USER_LOGIN = 'USER_LOGIN';
export function requestLogin(loginData) {
  return {
    type: USER_LOGIN,
    loginData,
    isFetching:true,
  }
}

export const RECEIVE_LOGIN_RESULT = 'RECEIVE_LOGIN_RESULT';
export function receiveLogin(err, user) {
  return {
    type: RECEIVE_LOGIN_RESULT,
    err,
    user,
    isFetching:false,
  }
}


export const USER_REGISTER = 'USER_REGISTER';
export function requestRegister(registerData) {
  return {
    type: USER_REGISTER,
    registerData,
    isFetching:true,
  }
}

export const USER_REGISTER_RESPONSE = 'USER_REGISTER_RESPONSE';
export function receiveRegister(user, err) {
  return {
    type: USER_REGISTER_RESPONSE,
    user,
    err,
    isFetching:false,
  }
}



export const INITIAL_AUTH = 'INITIAL_AUTH';
export function requestAuth() {
  return {
    type: INITIAL_AUTH,
    isFetching:true,
  }
}


export const RESULT_INITIAL_AUTH = 'RESULT_INITIAL_AUTH';
export function receiveAuth(err, user) {
  return {
    type: RESULT_INITIAL_AUTH,
    err,
    user,
    isFetching:false,
  }
}



export const LOGOUT_USER = 'LOGOUT_USER';
export function logoutUser() {
  return {
    type: LOGOUT_USER,
    user : null
  }
}

export function fetchLoginUser(loginData) {
  return function (dispatch) {
    dispatch(requestLogin(loginData));
    return AuthApi.login(loginData.login, loginData.password)
      .then(res =>{ 
        //console.log("RECEIVED LOGIN");
        //console.log(res);
        return dispatch(receiveLogin(res.err, res.user));
      })
      .catch(err =>
        dispatch(receiveLogin(err, null))
      );
  }
}
export function fetchAuth() {
  return function (dispatch) {
    dispatch(requestAuth());
    return UserApi.getAuthUser()
      .then(res =>
        dispatch(receiveAuth(res.err, res.user))
      )
      .catch(err =>
        dispatch(receiveAuth(err, null))
      );
  }
}

export function fetchRegister(registerData) {
  return function (dispatch) {
    dispatch(requestRegister(registerData));
    return AuthApi.register(registerData.login, registerData.password)
      .then(res =>
        dispatch(receiveRegister(res.user, res.err))
      )
      .catch(err =>
        dispatch(receiveRegister(null, err.message))
      );
  }
}

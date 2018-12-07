import UserApi from "../Api/UserApi";


export const GET_USERS = 'GET_USERS';
export function requestUsers(page, search_str) {
  return {
    type: GET_USERS,
    page,
    searchFilter : search_str,
    isFetching : true,
  }
}

export const GET_USERS_RESULT = 'GET_USERS_RESULT';
export function receiveUsers(err, users, page_count, curr_page) {
  return {
    type: GET_USERS_RESULT,
    users,
    err,
    currentPage: curr_page,
    pageCount : page_count,
    isFetching : false,
  }
}

export const GET_USER_BY_ID = 'GET_USER_BY_ID';
export function requestUser(id) {
  return {
    type: GET_USER_BY_ID,
    id,
    isFetching : true,
  }
}

export const GET_USER_BY_ID_RESULT = 'GET_USER_BY_ID_RESULT';
export function receiveUser(user, err) {
  return {
    type: GET_USER_BY_ID_RESULT,
    user,
    err,
    isFetching : false,
  }
}


export const SET_USER_ON_VIEW = 'SET_USER_ON_VIEW';
export function setUserOnView(user) {
  return {
    type: SET_USER_ON_VIEW,
    user,
    isFetching : false,
  }
}


export const UPDATE_USER = 'UPDATE_USER';
export function requestUpdUser(formData, id) {
  return {
    type: UPDATE_USER,
    formData,
    id,
    isUpdated: false,
    isFetching : true,
  }
}

export const UPDATE_USER_RESULT = 'UPDATE_USER_RESULT';
export function receiveUpdUser(oldUser, err) {
  return {
    type: UPDATE_USER_RESULT,
    oldUser,
    err,
    isUpdated : !err,
    isFetching : false,
  }
}


export function fetchUsers(page, search_str) {
  return function (dispatch) {
    dispatch(requestUsers(page, search_str));
    return UserApi.getUsers(page, search_str)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {users , page_count, this_page} = res.users;
        return dispatch(receiveUsers(res.err, users ,page_count, this_page))
      }).catch(err =>
        dispatch(receiveUsers(err, null))
      );
  }
}

export function fetchUserById(id) {
  return function (dispatch) {
    dispatch(requestUser(id));
    return UserApi.getById(id)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {user, err} = res;
        return dispatch(receiveUser(user, err))
      }).catch(err =>
        dispatch(receiveUser(null, err))
      );
  }
}



export function fetchUpdateUser(id, formData) {
  return function (dispatch) {
    dispatch(requestUpdUser(formData, id));
    return UserApi.updateUser(id, formData)
      .then(res => {
        // console.log("RESULT");
        // console.log(res);
        let {oldUser, err} = res;
        return dispatch(receiveUpdUser(oldUser, err))
      }).catch(err =>
        dispatch(receiveUpdUser(null, err))
      );
  }
}


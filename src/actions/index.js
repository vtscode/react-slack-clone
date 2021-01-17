import * as actionTypes from './types';
// user
export const setUser = user => {
  return {
    type : actionTypes.SET_USER,
    payload : {
      currentUser : user
    }
  }
}
export const clearUserFromGlobState = () => {
  return {
    type : actionTypes.CLEAR_USER,
  }
}

// channel
export const setCurrentChannel = chnnl => {
  return {
    type : actionTypes.SET_CURRENT_CHANNEL,
    payload : {
      currentChannel : chnnl
    }
  }
}

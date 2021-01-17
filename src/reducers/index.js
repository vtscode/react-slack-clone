import { combineReducers } from "redux";
import * as actionTypes from "../actions/types";

// user
const initUserState = {
  currentUser : null,
  isLoading : true
}
const user_reducer = (state = initUserState,action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        currentUser : action.payload.currentUser,
        isLoading : false
      }
    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading : false
      }
  
    default:
      return state;
  }
}


// channel
const initialChannelState = {
  currentChannel : null
}
const channel_reducer = (state = initialChannelState,action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel : action.payload.currentChannel
      }      
  
    default:
      return state
  }
}

const root_reducer = combineReducers({
  user : user_reducer,
  channel : channel_reducer
})

export default root_reducer;
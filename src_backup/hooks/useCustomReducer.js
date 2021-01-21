import React from "react";
const reducerData = (state,action) => {
  switch (action.varian) {
    case 'conventional':
      return {...state,
        [action.type] : action.payload
      }
    default:
      return {...state,
        [action.type] : {
          ...state[action.type],
          ...action.payload
        }
      }
  }
};

const useCustomReducer = props => {
  const [reducer,dispatchReducer] = React.useReducer(reducerData,props);
  const reducerFunc = (type,payload,varian = '') => {
    dispatchReducer({type,payload,varian});
  };
  return [reducer,reducerFunc];
};
export default useCustomReducer;
import * as types from '../const';

const INITIAL_STATE = {
  data: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.LOAD_DATA:
      return {
        ...state,
        data: action.payload
      }
    default:
      return state
    }
  }

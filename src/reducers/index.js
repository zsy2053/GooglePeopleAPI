import { combineReducers } from 'redux'
import googleReducer from './google'

const appReducer = combineReducers({
  google: googleReducer
})

const rootReducer = (state, action) => {
  return appReducer(state, action)
}

export default rootReducer

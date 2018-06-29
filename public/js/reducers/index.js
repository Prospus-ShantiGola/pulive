import { combineReducers } from 'redux'
import ChatReducer from './reducers'
import AddNewReducer from './add_new'

export default combineReducers({
  ChatReducer,
  AddNewReducer
})

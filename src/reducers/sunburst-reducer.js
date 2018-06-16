import { FETCH_DATA } from '../actions/index'

export default function (state = null, action) {
  switch (action.type){
    case FETCH_DATA:
      return action.payload
  }
  return state

}
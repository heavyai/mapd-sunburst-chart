import { combineReducers } from 'redux';
import SunburstReducer from './sunburst-reducer';

const rootReducer = combineReducers({
  sunburst: SunburstReducer
})

export default rootReducer;
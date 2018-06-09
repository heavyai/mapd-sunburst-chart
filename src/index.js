import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './components/app'
import rootReducer from './reducers/index';
import thunk from 'redux-thunk';
import {connectToMapdDatabase} from "./actions";

const store = createStore(rootReducer, applyMiddleware(thunk))

store.dispatch(connectToMapdDatabase())

const app = (
    <Provider store={store}>
      <App />
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'))


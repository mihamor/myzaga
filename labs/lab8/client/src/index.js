import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App/App';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { fetchAuth } from './actions/auth';
import rootReducer from './reducers/reducers';
import TracksApi from './Api/TrackApi';
import CommentApi from './Api/CommentApi';
TracksApi.setHostName('http://localhost:3016');
CommentApi.setHostName('http://localhost:3016');

const loggerMiddleware = createLogger();
const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    //loggerMiddleware // neat middleware that logs actions
  )
);
store.dispatch(fetchAuth()).then(() => console.log(store.getState()));
//store.dispatch(fetchPosts('reactjs')).then(() => console.log(store.getState()))





//import * as serviceWorker from './serviceWorker';
ReactDOM.render((
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  ), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
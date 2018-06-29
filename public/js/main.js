
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import App from './components/app';
import reducer from './reducers/reducers';
import { BrowserRouter } from 'react-router-dom'

const preloadedState = window.__PRELOADED_STATE__;
delete window.__PRELOADED_STATE__;
let pageHolderId = 'app';

let store = createStore(reducer, preloadedState);
let appElement = document.getElementById(pageHolderId);
if(appElement) {
    ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>,
        appElement
    );
}

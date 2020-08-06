import {AppRegistry} from 'react-native';
import React from 'react';
import App from './src/components/App';
import {name as appName} from './app.json';
import { createStore } from 'redux';
import myReducers from './src/reducer/index';
import { Provider } from 'react-redux';
const store = createStore( myReducers);
const RNRedux = () => (
    <Provider store = { store }>
      <App />
    </Provider>
)
AppRegistry.registerComponent(appName, () => RNRedux);

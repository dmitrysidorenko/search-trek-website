import Cycle from '@cycle/xstream-run';
import React from 'react';
import { Stream as xs } from 'xstream/core';
import { makeDomReactDriver } from './drivers/dom-react/index';
import './index.css';
import { makeHTTPDriver } from '@cycle/http';
import mockHTTPDriver from './mocks/mockHTTPDriver';
import { makeInteractDriver } from './drivers/interact/index';
import { makeRouterDriver } from 'cyclic-router/lib/makeRouterDriver';
import { createHashHistory as createHistory } from 'history';
import switchPath from 'switch-path';
import MobileDetect from 'mobile-detect';
import App from './components/app';
import { USE_MOCKS } from './config';
import firebase from 'firebase';

Cycle.run(App, {
  HTTP: USE_MOCKS ? mockHTTPDriver() : makeHTTPDriver(),
  DOM: makeDomReactDriver('#root'),
  router: makeRouterDriver(createHistory(), switchPath),
  DEVICE: () => {
    const md = new MobileDetect(window.navigator.userAgent);
    const IS_MOBILE = !!md.mobile();
    const DEVICE = IS_MOBILE ? 'mobile' : 'desktop';
    return xs.of(DEVICE);
  },
  interact: makeInteractDriver(),
  Firebase: () => {
    var config = {
      apiKey: "AIzaSyC5N0FavZVS3L-FWaBXnLtuKgC0qJ9CDUE",
      authDomain: "searchtrek.firebaseapp.com",
      databaseURL: "https://searchtrek.firebaseio.com",
      storageBucket: "searchtrek.appspot.com",
      messagingSenderId: "612488784459"
    };
    firebase.initializeApp(config);

    const proxy$ = xs.create();

    var treeRef = firebase.database().ref('tree');
    treeRef.on('value', function (s) {
      proxy$.shamefullySendNext(['tree', s]);
    });

    const all = {
      tree: proxy$.filter(([name, v]) => name === 'tree').map(([_, v]) => v)
    };

    return {
      get(name){
        return all[name] || xs.empty();
      }
    }
  },
  Action: (in$) => {
    return in$.map(a => a).debug('Action');
  }
});

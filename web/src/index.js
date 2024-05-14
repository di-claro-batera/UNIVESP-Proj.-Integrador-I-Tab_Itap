import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';
import { Provider  } from 'react-redux';
import store from './store';
import 'rsuite/dist/rsuite.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Routes/>
  </Provider>
);

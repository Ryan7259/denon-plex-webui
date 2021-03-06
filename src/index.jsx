import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store.js'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
)
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import './index.css'
import { Provider } from 'react-redux'
import store from './store.js'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
)
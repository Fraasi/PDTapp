import React from 'react'
import { render } from 'react-dom'
import ErrorBoundary from './src/components/Error'
import App from './src/components/App'
import './global.css'

// console.log(process)
render(
    <ErrorBoundary>
      <App />
    </ ErrorBoundary>,
    document.getElementById('app')
)

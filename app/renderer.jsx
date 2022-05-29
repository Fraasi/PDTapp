import React from 'react'
import { createRoot } from 'react-dom/client'
import ErrorBoundary from './src/components/Error'
import App from './src/components/App'
import './global.css'

const root = createRoot(document.getElementById('app'))
root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
)

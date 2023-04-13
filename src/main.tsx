import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import React from 'react'

import { AppProvider, ReactQueryProvider } from '~/shared/contexts'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
)

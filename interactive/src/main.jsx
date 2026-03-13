import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './config/msal'
import App from './App'
import './index.css'

msalInstance.initialize().then(() => {
  msalInstance.handleRedirectPromise().then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <MsalProvider instance={msalInstance}>
            <App />
          </MsalProvider>
        </BrowserRouter>
      </React.StrictMode>
    )
  })
})

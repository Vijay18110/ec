import React, { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Loader from './ExternalLib/Loader/Loader.jsx'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Redux/Store/Store.js'
import { ToastContainer } from 'react-toastify'
const App = React.lazy(() => import('./App.jsx'))
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      className="custom-toast"
    />
  </StrictMode>,
)

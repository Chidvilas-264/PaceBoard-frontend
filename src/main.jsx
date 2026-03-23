import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import axios from 'axios'
import App from './App.jsx'
import './index.css'

// Hardcoding backend Render URL so it never fails on Vercel deployment
axios.defaults.baseURL = 'https://paceboard-backend.onrender.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)

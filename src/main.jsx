import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {AuthProvider} from './context/context.jsx'
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')).render(

    <AuthProvider>
      <ToastContainer position="top-right" autoClose={5000} /> 
    <App />
    </AuthProvider>
)

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/UserContext'
import CaptainContext from './context/CaptainContext.jsx'
import SocketProvider from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <UserContext>
    <CaptainContext>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </CaptainContext>
  </UserContext>
)
// Force redeploy Fri, May 30, 2025  2:17:34 AM

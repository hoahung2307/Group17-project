import { useState } from 'react'
import UserPage from './pages/UserPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import ProtectedRoute from './components/Auth/ProtectedRoute'


function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {
            <UserPage/>
          } />
          <Route path = "/login" element = {<LoginPage/>}/>
          <Route path = "/register" element = {<RegisterPage/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import UserPage from './pages/Admin/UserPage'
import Home from './pages/Home'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import ProtectedRoute from './components/Auth/ProtectedRoute'


function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {
            <Home/>
          } />
          <Route path = "/login" element = {<LoginPage/>}/>
          <Route path = "/register" element = {<RegisterPage/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App

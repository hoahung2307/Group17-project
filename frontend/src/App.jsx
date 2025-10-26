import Home from './pages/Home'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import ProfilePage from './pages/Users/ProfilePage'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import AdminRoute from './components/Admin/AdminRoute.jsx'
import AdminLoginPage from './pages/Admin/AdminLoginPage.jsx';
import UserPage from './pages/Admin/UserPage.jsx'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path = "/" element = {<Home/>}>
            <Route index element={<></>} />
            <Route path = "profile" element = {
              <ProtectedRoute>
                <ProfilePage/>
              </ProtectedRoute>
            }/>
          </Route>
          <Route path = "/login" element = {<LoginPage/>}/>
          <Route path = "/register" element = {<RegisterPage/>}/>
          <Route path = "/reset-password" element = {<ForgotPasswordPage/>}/>
          <Route path = "/reset-password/:token" element = {<ResetPasswordPage/>}/>
          <Route path = "/admin/login" element = {<AdminLoginPage/>}/>
          <Route path = "/admin" element = {
            <ProtectedRoute>
              <AdminRoute>
                <UserPage/>
              </AdminRoute>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

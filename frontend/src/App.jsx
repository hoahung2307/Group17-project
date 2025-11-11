import Home from './pages/Home'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/Auth/ResetPasswordPage'
import ProfilePage from './pages/Users/ProfilePage'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLoginPage from './pages/Admin/AdminLoginPage.jsx';
import UserPage from './pages/Admin/UserPage.jsx';
import ModeratorLoginPage from './pages/Moderator/ModeratorLoginPage.jsx';
import UserManagementPage from './pages/Moderator/UserManagementPage.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ModeratorRoute from './components/Moderator/ModeratorRoute.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<></>} />
            <Route path="profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <UserPage />
            </ProtectedRoute>
          } />
          <Route path="/moderator/login" element={<ModeratorLoginPage />} />
          <Route path="/moderator" element={
            <ProtectedRoute requiredRole="moderator">
              <UserManagementPage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App

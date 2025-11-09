import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  console.log('[ProtectedRoute] Redux state:', { isAuthenticated, user });
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Chưa đăng nhập, chuyển hướng đến /login');
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log(`[ProtectedRoute] Không đủ quyền (${user?.role}), cần: ${requiredRole}. Chuyển hướng về trang chủ.`);
    return <Navigate to="/" replace />;
  }

  console.log('[ProtectedRoute] Truy cập hợp lệ, render children');
  return children;
};

export default ProtectedRoute;

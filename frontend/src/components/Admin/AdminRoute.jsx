import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext.jsx';

function AdminRoute({ children }) {
    const { user, loading } = useContext(AuthContext) || {};

    if (loading) {
        return <div>Loading...</div>;
    }

    return user && user.role === 'admin' ? children : <Navigate to="/" />;
}

export default AdminRoute;
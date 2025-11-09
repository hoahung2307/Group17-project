import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ModeratorRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user || user.role !== 'moderator') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ModeratorRoute;
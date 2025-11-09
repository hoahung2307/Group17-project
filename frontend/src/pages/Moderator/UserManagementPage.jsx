import UserList from '../../components/Moderator/UserList';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import "../../styles/UserPage.css";
const UserManagementPage = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'moderator') {
    return <Navigate to="/moderator/login" replace />;
  }

  return (
    <div className="page-container">
      <h1>Moderator</h1>
      <UserList />
    </div>
  );
};

export default UserManagementPage;
import { useState, useEffect, useMemo } from 'react';
import api from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const { token } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/moderator/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(response.data) ? response.data : response.data.Users || []);
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

const filteredUsers = useMemo(() => {
  const visibleUsers = users.filter(u => u.role !== 'admin' && u.role !== 'moderator');
  if (!query) return visibleUsers;
  const q = query.toLowerCase();
  return visibleUsers.filter(u => (u.email || '').toLowerCase().includes(q) || (u.role || '').toLowerCase().includes(q));
}, [users, query]);

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      const action = isBlocked ? 'unblock' : 'block';
      await api.patch(`/users/${userId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers(); // Refresh the list after action
    } catch (err) {
      setError(`Failed to ${isBlocked ? 'unblock' : 'block'} user`);
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-card">
        <div className="user-list-header">
          <h2>Người dùng</h2>
          <div className="search-wrapper">
            <input
              type="search"
              placeholder="Tìm theo email hoặc role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th className="col-avatar">&nbsp;</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="avatar" title={user.email}>
                      {(user.email && user.email.charAt(0).toUpperCase()) || '?'}
                    </div>
                  </td>
                  <td className="email-cell">{user.email}</td>
                  <td>
                    <span className={`role-badge role-${(user.role || 'user').toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${user.isBlocked ? 'blocked' : 'active'}`}>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                        className={user.isBlocked ? 'unblock-btn' : 'block-btn'}
                        aria-label={`${user.isBlocked ? 'Unblock' : 'Block'} ${user.email}`}
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="no-results">Không tìm thấy người dùng.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
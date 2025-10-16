import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
function UserList({ refreshTrigger, onEdit }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            let response;
            const maxRetries = 3;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    response = await axios.get("http://localhost:3000/users");
                    break;
                } catch (e) {
                    if (i === maxRetries - 1) throw e;
                    const delay = Math.pow(2, i) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }

            if (!response) {
                throw new Error("No response");
            }

            const responseData = response.data;
            if (responseData && Array.isArray(responseData.Users)) {
                setUsers(responseData.Users);
            } else {
                console.error(responseData);
                setError("Error");
                setUsers([]);
            }

        } catch (err) {
            console.error("Error", err);
            setError((err.message));
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, refreshTrigger]);

    const handleDelete = async (userId) => {
            try {
                await axios.delete(`http://localhost:3000/users/${userId}`);
                alert("Xóa thành công!");
                fetchUsers();
            } catch (err) {
                console.error("Lỗi khi xóa:", err);
                alert("Có lỗi xảy ra");
            }
    };

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div><p>Có lỗi xảy ra</p><p>{error}</p></div>;

    return (
        <div className="user-list-container">
            <h2>Danh Sách Người Dùng</h2>
            {(users && users.length > 0) ? (
                <div className="user-list">
                    {users.map((user) => (
                        <div key={user._id || user.id} className="user-item">
                            <p>Tên: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <button onClick={() => onEdit(user)}>Sửa</button>
                            <button onClick={() => handleDelete(user._id || user.id)}>Xóa</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-user-message">Not Found.</div>
            )}
        </div>
    );
}

export default UserList;
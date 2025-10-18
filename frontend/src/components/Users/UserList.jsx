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
                throw new Error("No response from server after multiple retries.");
            }

            const responseData = response.data;
            if (responseData && Array.isArray(responseData.Users)) {
                setUsers(responseData.Users);
            } else {
                console.error("Unexpected response data format:", responseData);
                setError("Dữ liệu nhận được không đúng định dạng.");
                setUsers([]);
            }

        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message || "Có lỗi xảy ra khi tải danh sách.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, refreshTrigger]);

    const handleDelete = async (userId) => {
        if (window.confirm("Xóa người dùng này ?")) {
            try {
                await axios.delete(`http://localhost:3000/users/${userId}`);
                alert("Xóa người dùng thành công!");
                fetchUsers();
            } catch (err) {
                console.error("Lỗi khi xóa người dùng:", err);
                alert("Có lỗi xảy ra khi xóa người dùng.");
            }
        }
    };

    if (isLoading) return <div className="loading-message">Đang tải dữ liệu...</div>;
    if (error) return <div className="error-message"><p>Có lỗi xảy ra: {error}</p></div>;

    return (
        <div className="user-list-container">
            {users && users.length > 0 ? (
                <div className="user-list">
                    {users.map((user) => (
                        <div key={user._id || user.id} className="user-item">
                            <div className="user-item-info">
                                <p><strong>Tên:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                            <div className="user-item-actions">
                                <button className="edit-btn" onClick={() => onEdit(user)}>Sửa</button>
                                <button className="delete-btn" onClick={() => handleDelete(user._id || user.id)}>Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-users-message">Không tìm thấy người dùng nào.</div>
            )}
        </div>
    );
}

export default UserList;

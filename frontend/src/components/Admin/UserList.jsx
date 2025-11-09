import React, { useState, useEffect, useCallback } from 'react';
import api from "../../api/api";

function UserList({ refreshTrigger }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State cho logs
    const [logs, setLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(false);
    const [errorLogs, setErrorLogs] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            let response;
            const maxRetries = 3;
            for (let i = 0; i < maxRetries; i++) {
                try {
                    response = await api.get("http://localhost:3000/admin/users");
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

    // Lấy danh sách users
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers, refreshTrigger]);

    // Lấy logs khi component mount
    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoadingLogs(true);
            setErrorLogs(null);
            try {
                const response = await api.get("/admin/logs?limit=50");
                if (response.data && Array.isArray(response.data.logs)) {
                    setLogs(response.data.logs);
                } else {
                    setLogs([]);
                    setErrorLogs("Dữ liệu log không đúng định dạng.");
                }
            } catch (err) {
                setLogs([]);
                setErrorLogs(err.message || "Có lỗi khi tải logs.");
            } finally {
                setIsLoadingLogs(false);
            }
        };
        fetchLogs();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm("Xóa người dùng này?")) {
            try {
                await api.delete(`http://localhost:3000/admin/users/${userId}`);
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
            {/* Danh sách người dùng */}
            {users && users.length > 0 ? (
                <div className="user-list">
                    {users.map((user) => (
                        <div key={user._id || user.id} className="user-item">
                            <div className="user-item-info">
                                <p><strong>Tên:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                            </div>
                            <div className="user-item-actions">
                                <button className="delete-btn" onClick={() => handleDelete(user._id || user.id)}>Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-users-message">Không tìm thấy người dùng nào.</div>
            )}

            {/* Hiển thị logs cho admin */}
            <div className="admin-logs-section" style={{ marginTop: '2rem' }}>
                <h2>Hoạt động hệ thống (Logs)</h2>
                {isLoadingLogs ? (
                    <div className="loading-message">Đang tải logs...</div>
                ) : errorLogs ? (
                    <div className="error-message">{errorLogs}</div>
                ) : logs.length > 0 ? (
                    <div className="logs-list" style={{ maxHeight: '300px', overflowY: 'auto', background: '#f9f9f9', border: '1px solid #ddd', padding: '1rem' }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {logs.map((log, idx) => (
                                <li key={idx} style={{ fontSize: '0.95rem', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.3rem' }}>{log}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="no-logs-message">Không có log nào.</div>
                )}
            </div>
        </div>
    );
}

export default UserList;

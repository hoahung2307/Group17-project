import React, { useState, useEffect } from 'react';
import api from "../../api/api";

function EditUser({ user, onUpdate, onCancel }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.put(`http://localhost:3000/users/${user._id}`, {
                name,
                email,
            });

            if (response.status === 200) {
                alert("Cập nhật thông tin thành công!");
                onUpdate();
            } else {
                setError("Cập nhật thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật:", err);
            setError("Có lỗi xảy ra phía máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="form-container">
            <h3>Chỉnh sửa thông tin người dùng</h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="edit-name">Tên:</label>
                    <input
                        id="edit-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="edit-email">Email:</label>
                    <input
                        id="edit-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                    <button className="cancel-btn" type="button" onClick={onCancel} disabled={loading}>
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditUser;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            const response = await axios.put(`http://localhost:3000/users/${user._id}`, {
                name,
                email,
            });

            if (response.status === 200) {
                console.log("Done");
                onUpdate();
            } else {
                setError("Error");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="edit-user-container">
            <h3>Chỉnh sửa thông tin</h3>
            {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Tên:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button type="button" onClick={onCancel} disabled={loading}>
                    Hủy
                </button>
            </form>
        </div>
    );
}

export default EditUser;
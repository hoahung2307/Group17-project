import api from "../../api/api";
import { useState } from "react";

function AddUser({ onUserAdded, onCancel }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post('http://localhost:3000/users', { name, email });
            if (res.status === 201 || res.status === 200) {
                alert("Thêm người dùng thành công!");
                if (onUserAdded) {
                    onUserAdded();
                }
                setName('');
                setEmail('');
            } else {
                setError("Thêm người dùng thất bại. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error("Lỗi khi thêm user:", err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Có lỗi xảy ra phía máy chủ.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h3>Thêm người dùng mới</h3>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Tên:</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>
                <div className="form-actions">
                    <button className="submit-btn" type="submit" disabled={loading}>
                        {loading ? 'Đang thêm...' : 'Thêm'}
                    </button>
                    <button className="cancel-btn" type="button" onClick={onCancel} disabled={loading}>
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUser;

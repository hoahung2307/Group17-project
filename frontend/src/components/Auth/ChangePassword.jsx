import { useState, useContext } from 'react';
import api from '../../api/api';
import AuthContext from '../../contexts/AuthContext';
import '../../styles/ChangePassword.css';

function ChangePassword({ onClose }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { logout } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            const res = await api.put('/user/profile/password', { oldPassword, newPassword });
            setMessage(res.data.message + " Tự động đăng xuất sau 5 giây.");
            setOldPassword('');
            setNewPassword('');
            setTimeout(() => {
                onClose();
                logout();
            }, 5000);
        } catch (err) {
            setError(err.response?.data?.message || 'Đã có lỗi xảy ra.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Đổi Mật Khẩu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Mật khẩu cũ</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    {message && <p className="success-message">{message}</p>}
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">Cập nhật</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;

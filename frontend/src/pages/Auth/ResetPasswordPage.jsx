import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resetPassword } from '../../api/api';
import '../../styles/LoginPage.css';

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Mật khẩu không khớp.');
            return;
        }
        setError('');
        setMessage('');

        try {
            await resetPassword(token, password);
            setMessage('Mật khẩu đã được đặt lại thành công. Bạn sẽ được chuyển hướng đến trang đăng nhập.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Đặt Lại Mật Khẩu</h1>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="login-input-container">
                    <label className="login-label" htmlFor="password">Mật Khẩu Mới:</label>
                    <input 
                        className="login-input" 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="login-input-container">
                    <label className="login-label" htmlFor="confirm-password">Xác Nhận Mật Khẩu:</label>
                    <input 
                        className="login-input" 
                        id="confirm-password" 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="login-button" type="submit">Đặt Lại Mật Khẩu</button>
                <div className="login-links">
                    <Link to="/login">Quay lại Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
}

export default ResetPasswordPage;

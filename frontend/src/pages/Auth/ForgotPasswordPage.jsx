import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { requestPasswordReset } from '../../api/api';
import '../../styles/LoginPage.css';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            await requestPasswordReset(email);
            setMessage('Nếu email tồn tại trong hệ thống, bạn sẽ nhận được một email hướng dẫn đặt lại mật khẩu.');
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Đặt Lại Mật Khẩu</h1>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
                <div className="login-input-container">
                    <label className="login-label" htmlFor="email">Email:</label>
                    <input
                        className="login-input"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button className="login-button" type="submit">Gửi Yêu Cầu</button>
                <div className="login-links">
                    <Link to="/login">Quay lại Đăng nhập</Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotPasswordPage;
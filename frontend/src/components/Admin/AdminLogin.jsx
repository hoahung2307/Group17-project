import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "../../styles/LoginPage.css"

function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors("");
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });
            if (res.status === 200) {
                await login();
                navigate("/admin");
            } else {
                setErrors(res.message);
            }
        } catch (err) {
            setErrors(err.message);
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    return <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <div >
                <h1 >Đăng nhập Admin</h1>
                {errors && (
                    <div className="login-error" role="alert">
                        <p>{errors}</p>
                    </div>
                )}
            </div>
            <div  className="login-input-container">
                <label className="login-label" htmlFor="username">Email</label>
                <input className="login-input" id="username" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="login-label" htmlFor="password">Mật khẩu</label>
                <input className="login-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="login-button" type="submit">{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>
    </div>
}

export default AdminLogin;
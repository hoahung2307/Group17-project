import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import AuthContext from "../../contexts/AuthContext.jsx";
import "../../styles/LoginPage.css"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors("");
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });
            console.log(res.data);
            if (res.status === 200) {
                login(res.data.user);
                navigate("/");
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
                <h1 >Đăng nhập</h1>
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
            <div className="login-signup">
                <button type="button" className="register-button" onClick={() => navigate('/register')}>Đăng ký</button>
            </div>
            <div className="login-links">
                <Link to="/reset-password">Quên Mật Khẩu?</Link>
            </div>

        </form>
    </div>
}

export default Login;
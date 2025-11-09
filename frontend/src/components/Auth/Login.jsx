import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, fetchProfile } from "../../store/authSlice";
import "../../styles/LoginPage.css";
import { REFRESH_TOKEN } from "../../constants/constants.js";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors("");
        console.log("[Login] Submit login form", { email, password });
                dispatch(login({ email, password }))
                        .unwrap()
                        .then((data) => {
                                console.log("[Login] Login success, response:", data);
                                localStorage.setItem(REFRESH_TOKEN, data.refreshToken);
                                console.log("[Login] Token saved to localStorage:", data.refreshToken);
                                dispatch(fetchProfile())
                                    .unwrap()
                                    .then(() => {
                                        navigate("/");
                                    })
                                    .catch((err) => {
                                        console.log("[Login] Fetch profile failed:", err);
                                        setErrors(err?.message || "Không lấy được thông tin user");
                                    });
                        })
                        .catch((err) => {
                                console.log("[Login] Login failed:", err);
                                setErrors(err?.message || "Đăng nhập thất bại");
                        });
    };

    // Theo dõi Redux state
    console.log("[Login] Redux state:", { loading, error, isAuthenticated, user });

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div>
                    <h1>Đăng nhập</h1>
                    {(errors || error) && (
                        <div className="login-error" role="alert">
                            <p>{
                                typeof (errors || error) === 'object'
                                    ? (errors || error).message
                                    : (errors || error)
                            }</p>
                        </div>
                    )}
                </div>
                <div className="login-input-container">
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
    );
}

export default Login;
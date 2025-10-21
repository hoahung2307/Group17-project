import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
import "../../styles/LoginPage.css"
import api from "../../api/api";


function Login({ route }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors("");
        e.preventDefault();
        try {
            const res = await api.post(route, {
                email,
                password
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                window.history.replaceState(null, 'Home', '/');
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
        </form>
    </div>
}

export default Login;
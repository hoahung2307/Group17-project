import { useState, useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants/constants";
import "../../styles/LoginPage.css"
import api from "../../api/api";


function Register({ route }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
    }, []);

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors("");
        e.preventDefault();
        if (!name || !email || !password) {
            setErrors("Vui lòng điền đầy đủ thông tin.");
            setLoading(false);
            return;
        }
        try {
            const res = await api.post(route, {
                email,
                name,
                password
            });
            if (res.status === 200) {
                setErrors("Đăng ký thành công, bạn sẽ được chuyển đến trang đăng nhập sau 5 giây");
                setTimeout(() => {
                    navigate("/login");
                }, 5000);
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
                <h1 >Đăng Ký</h1>
                {errors && (
                    <div className="login-error" role="alert">
                        <p>{errors}</p>
                    </div>
                )}
            </div>
            <div className="login-input-container">
                <label className="login-label" htmlFor="name">Tên</label>
                <input className="login-input" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label className="login-label" htmlFor="email">Email</label>
                <input className="login-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label className="login-label" htmlFor="password">Mật khẩu</label>
                <input className="login-input" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button className="login-button" type="submit">{loading ? 'Đang đăng ký...' : 'Đăng ký'}</button>
            <div className="login-links">
                <Link to="/login">Quay lại Đăng nhập</Link>
            </div>
        </form>
    </div>
}

export default Register;
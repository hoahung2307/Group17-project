import { useContext, useState, useRef, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext.jsx';
import Logout from '../components/Auth/Logout';
import ChangePassword from '../components/Auth/ChangePassword.jsx';
import '../styles/HomePage.css';

function Home () {
    const { user, loading } = useContext(AuthContext);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [headerTitle, setHeaderTitle] = useState('Trang Chủ');
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-container">
            <header className="main-header">
                <Link to="/" onClick={() => setHeaderTitle('Trang Chủ')} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h1>{headerTitle}</h1>
                </Link>
                {user ? (
                    <div className="avatar-container" ref={dropdownRef}>
                        <img src={user.avatar || null} alt="Avatar" className="avatar" onClick={() => setDropdownVisible(!dropdownVisible)} />
                        {dropdownVisible && (
                            <div className="dropdown-menu">
                                <Link to="/profile" onClick={() => setDropdownVisible(false)}>Trang cá nhân</Link>
                                <button onClick={() => { setDropdownVisible(false); setShowChangePassword(true); }}>Đổi mật khẩu</button>
                                <Logout />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="login-btn">Đăng Nhập</button>
                    </Link>
                )}
            </header>
            <main>
                <Outlet context={{ setHeaderTitle }} />
            </main>
            {showChangePassword && <ChangePassword onClose={() => setShowChangePassword(false)} />}
        </div>
    )
}

export default Home;

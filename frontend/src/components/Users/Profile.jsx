import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext.jsx';
import { updateProfileImage, updateProfileName, deleteUser } from '../../api/api.js';
import '../../styles/ProfilePage.css';
import { Pencil } from 'lucide-react';

function Profile() {
    const { user, login, logout } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            await updateProfileImage(formData);
            login();
        } catch (err) {
            setError('Lỗi khi đổi ảnh');
            console.error(err);
        }
    };

    const handleNameSave = async () => {
        if (newName.trim() === "") {
            setError("Tên không được trống");
            return;
        }
        try {
            await updateProfileName(newName);
            login();
            setIsEditingName(false);
            setError("");
        } catch (err) {
            setError('Lỗi khi đổi tên');
            console.error(err);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản?')) {
            try {
                await deleteUser(user._id);
                await logout();
                navigate('/');
            } catch (err) {
                setError('Lỗi khi xóa tài khoản');
                console.error(err);
            }
        }
    };

    return (
        <div className="profile-container">
            {error && <p className="error-message">{error}</p>}
            <div className="profile-content">
                <div className="profile-avatar-section" onClick={handleAvatarClick} title="Click to change avatar">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                    <img src={user.avatar || null} alt="Avatar" className="profile-avatar editable"/>
                    <div className="avatar-overlay">
                        <Pencil size={24} color="white" />
                    </div>
                </div>
                <div className="profile-info-section">
                    <div className="name-container">
                        {isEditingName ? (
                            <div className="edit-name">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="save-btn"
                                />
                                <button className='save' onClick={handleNameSave}>Lưu</button>
                                <button onClick={() => setIsEditingName(false)} className="cancel-btn">Hủy</button>
                            </div>
                        ) : (
                            <p>{user.name}
                                <button className="edit-btn" onClick={() => { setIsEditingName(true); setNewName(user.name); }}>
                                    <Pencil size={18} strokeWidth={2.5} />
                                </button>
                            </p>
                        )}
                    </div>
                    <p className="item-field">Email: {user.email}</p>
                    <p className="item-field">Vai trò: {user.role}</p>
                </div>
            </div>
            <div className="profile-actions">
                <button onClick={handleDeleteAccount} className="delete-account-btn">Xóa tài khoản</button>
            </div>
        </div>
    );
}

export default Profile;

import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { updateProfileImage, updateProfileName, deleteUser } from '../../api/api.js';
import '../../styles/ProfilePage.css';
import { Pencil } from 'lucide-react';

function Profile() {
    const { user, login, logout } = useAuth();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [error, setError] = useState("");
    const [previewImage, setPreviewImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        setPreviewImage(URL.createObjectURL(file));
        setShowPreview(true);
    };

    const resizeImage = (file, maxWidth = 300, maxHeight = 300) => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth || height > maxHeight) {
                    const aspect = width / height;
                    if (width > height) {
                        width = maxWidth;
                        height = Math.round(maxWidth / aspect);
                    } else {
                        height = maxHeight;
                        width = Math.round(maxHeight * aspect);
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Resize failed'));
                    }
                }, file.type || 'image/jpeg', 0.9);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const handleSaveImage = async () => {
        if (!selectedFile) return;
        try {
            const resizedBlob = await resizeImage(selectedFile);
            const formData = new FormData();
            formData.append('image', resizedBlob, selectedFile.name);
            await updateProfileImage(formData);
            login();
            setShowPreview(false);
            setPreviewImage(null);
            setSelectedFile(null);
        } catch (err) {
            setError('Lỗi khi đổi ảnh');
            console.error(err);
        }
    };

    const handleCancelImage = () => {
        setShowPreview(false);
        setPreviewImage(null);
        setSelectedFile(null);
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
            {showPreview && (
                <div className="popup-preview" style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div style={{background:'#fff', padding:24, borderRadius:8, boxShadow:'0 2px 8px rgba(0,0,0,0.2)', textAlign:'center'}}>
                        <h3>Xem trước ảnh đại diện</h3>
                        <img src={previewImage} alt="Preview" style={{maxWidth:300, maxHeight:300, borderRadius:'50%', objectFit:'cover', width:'auto', height:'auto', display:'block', margin:'0 auto'}} />
                        <div style={{marginTop:16}}>
                            <button onClick={handleSaveImage} style={{marginRight:8}} className="save">Lưu</button>
                            <button onClick={handleCancelImage} className="cancel-btn">Hủy</button>
                        </div>
                    </div>
                </div>
            )}
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

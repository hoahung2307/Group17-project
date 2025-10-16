import axios from "axios";
import { useState } from "react";
function AddUser({ onUserAdded, onCancel }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors("");
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/users', {
                name,
                email
            });
            if (res.status === 201 || res.status === 200) {
                console.log("Thêm user thành công");
                if (onUserAdded) {
                    onUserAdded();
                }
                setName('');
                setEmail('');
            } else {
                console.log("Thêm thất bại");
                setErrors("Thêm thất bại.");
            }
        } catch (err) {
            console.error("Lỗi khi thêm user:", err);
            if (err.response && err.response.data) {
                setErrors(err.response.data.message);
            } else {
                setErrors("Có lỗi xảy ra");
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h3>Thêm người dùng mới</h3>
            {errors && <p style={{ color: 'red' }}>Lỗi: {errors}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} required />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Đang thêm...' : 'Thêm'}
                </button>
                <button type="button" onClick={onCancel} disabled={loading}>
                    Hủy
                </button>
            </form>
        </div>
    )
}

export default AddUser;
import axios from "axios";
import { useState } from "react";

function AddUser () {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        setLoading(true);
        setErrors("");
        setTimeout(1000);
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/users', {
                name,
                email
            });
            if (res.status === 200) {
                console.log("Thêm user thành công");
            } else {
                console.log("Thêm thất bại");
            }
        } catch (err) {
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <button type="submit">Add</button>
            </form>
        </div>
    )
}

export default AddUser;
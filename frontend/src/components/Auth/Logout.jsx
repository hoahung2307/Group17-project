import { useState } from "react"
import api from "../../api/api"

function Logout () {

    const handleLogout = async(e) => {
        const res = await api.post("http://localhost:3000/logout")
        console.log(res)
        if (res.status === 200) {
            window.location.href = "/login"
        } else {
            alert("Đăng xuất không thành công")
        }
    }

    return (
        <div>
            <button onClick={handleLogout}>Đăng xuất</button>
        </div>
    )
}

export default Logout
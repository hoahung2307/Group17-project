import React from "react";
import AddUser from "../components/AddUser";
import UserList from "../components/UserList";

function UserPage () {
    return(
        <div>
            <div>
                <AddUser />
            </div>
            <div>
                <UserList />
            </div>
        </div>
    )
}

export default UserPage;
import React, { useState } from "react";
import AddUser from "../components/AddUser";
import UserList from "../components/UserList";
import EditUser from "../components/EditUser";
import "../styles/UserPage.css";

function UserPage() {

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const [view, setView] = useState('list');

    const [currentUser, setCurrentUser] = useState(null);

    const handleUserAdded = () => {
        setRefreshTrigger(prev => prev + 1);
        setView('list');
    };

    const handleUserUpdated = () => {
        setRefreshTrigger(prev => prev + 1);
        setView('list');
        setCurrentUser(null);
    }

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setView('edit');
    }

    const renderContent = () => {
        switch (view) {
            case 'add':
                return <AddUser onUserAdded={handleUserAdded} onCancel={() => setView('list')} />;
            case 'edit':
                return <EditUser user={currentUser} onUpdate={handleUserUpdated} onCancel={() => setView('list')} />;
            case 'list':
            default:
                return (
                    <div>
                        <button onClick={() => setView('add')}>Thêm mới</button>
                        <UserList refreshTrigger={refreshTrigger} onEdit={handleEditClick} />
                    </div>
                );
        }
    };

    return (
        <div>
            {renderContent()}
        </div>
    );
}

export default UserPage;
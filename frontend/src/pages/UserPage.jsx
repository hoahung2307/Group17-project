import React, { useState } from "react";
import AddUser from "../components/Users/AddUser";
import UserList from "../components/Users/UserList";
import EditUser from "../components/Users/EditUser";
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
    };

    const handleEditClick = (user) => {
        setCurrentUser(user);
        setView('edit');
    };

    const renderContent = () => {
        switch (view) {
            case 'add':
                return <AddUser onUserAdded={handleUserAdded} onCancel={() => setView('list')} />;
            case 'edit':
                return <EditUser user={currentUser} onUpdate={handleUserUpdated} onCancel={() => setView('list')} />;
            case 'list':
            default:
                return <UserList refreshTrigger={refreshTrigger} onEdit={handleEditClick} />;
        }
    };

    return (
        <div className="user-page-container">
            <header className="user-page-header">
                <h1 className="header-title">Danh sách User</h1>
                <button className="add-btn" onClick={() => setView('add')}>Thêm</button>
            </header>
            <main className="user-page-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default UserPage;

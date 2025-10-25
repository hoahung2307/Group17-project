import { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import Profile from '../../components/Users/Profile';

function ProfilePage() {
    const { setHeaderTitle } = useOutletContext();

    useEffect(() => {
        setHeaderTitle('Trang cá nhân');
        return () => {
            setHeaderTitle('Trang Chủ');
        };
    }, [setHeaderTitle]);

    return (
        <Profile />
    );
}

export default ProfilePage;

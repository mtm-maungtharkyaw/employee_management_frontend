import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

const GuestGuard = () => {
    const { authUser, isCheckingAuth } = useAuth()

    if(isCheckingAuth) return null

    return !authUser ? <Outlet /> : <Navigate to="/" replace/>;
}

export default GuestGuard
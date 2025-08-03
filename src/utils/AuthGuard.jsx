import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../contexts/AuthContext'

const AuthGuard = () => {
    const { authUser, isCheckingAuth } = useAuth()

    if(isCheckingAuth) return null

    return authUser ? <Outlet /> : <Navigate to="/employee-login" replace/>;
}

export default AuthGuard
import React, { useState } from 'react'
import '../styles/layout.css'

// react router
import { NavLink } from 'react-router-dom'

// components
import Loading from './common/Loading';

// icons
import { GiHamburgerMenu } from "react-icons/gi"
import { FaCaretDown } from "react-icons/fa6";

// theme context
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useOtp } from '../contexts/OtpContext';

// constants
import { AUTH_ROLES } from '../constants/role';

export default function Header() {
    const themeCtx = useTheme()
    const authCtx = useAuth()
    const optCtx = useOtp()

    const [showLoading, setShowLoading] = useState(false)

    const logout = () => {
        setShowLoading(true)
        const start = Date.now()
        const elapsed = Date.now() - start
        const delay = Math.max(400 - elapsed, 0)
        setTimeout(() => {
            setShowLoading(false)
            authCtx.logout()
            optCtx.clearAccessToken()
        }, delay);
    }

    return (
        <>
            {showLoading && <Loading />}
            <header className="header">
                <div className='flex justify-between items-center'>
                    <div className='flex space-x-5 items-center'>
                        <button className='text-[#406c91] cursor-pointer' onClick={themeCtx.toggleSidebar}>
                            <GiHamburgerMenu size={22} />
                        </button>
                        <span className='dark-blue text-md'>Welcome, {authCtx.authUser?.role === "admin" ? "Admin" : authCtx.authUser?.name}</span>
                    </div>
                    <div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="m-1 flex items-center space-x-1 cursor-pointer border-none bg-transparent p-0">
                                <div className='w-[35px] h-[35px] bg-[#406c91] rounded-full'>
                                    {/* <img src="" alt="" /> */}
                                </div>
                                <span><FaCaretDown size={22} /></span>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-sm z-1 w-45 p-1 shadow-sm">
                                <li>
                                    <NavLink to={authCtx.authUser?.role === AUTH_ROLES.ADMIN ? '/adminProfile' : '/employeeProfile'}>Profile</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/changePassword" >Change Password</NavLink>
                                </li>
                                <li>
                                    <button onClick={logout} disabled={showLoading}>Logout</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

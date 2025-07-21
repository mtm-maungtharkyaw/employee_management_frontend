import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'

// icons
import { MdDashboard, MdPerson } from "react-icons/md"
import { FaUsers, FaRegClock } from "react-icons/fa6"
import { FaAngleDown } from "react-icons/fa"
import { FaListUl } from "react-icons/fa"
import { FaHistory } from "react-icons/fa"
import { FaClipboardCheck } from "react-icons/fa"

import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

import { AUTH_ROLES } from '../constants/role'

export default function Sidebar() {
    const themeCtx = useTheme()
    const authCtx = useAuth()
    const [openMenu, setOpenMenu] = useState(null)

    const activeClass = ({ isActive }) => isActive ? 'main-link space-x-2 active' : 'main-link space-x-2'
    const sidebarClass = themeCtx.isSidebarOpen ? 'sidebar open' : 'sidebar'

    const toggleMenu = (event, menu) => {
        event.preventDefault()
        if (!themeCtx.isSidebarOpen) return
        if (openMenu === menu) {
            setOpenMenu(null)
        } else {
            setOpenMenu(menu)
        }
    }

    return (
        <aside className={sidebarClass}>
            <h2 className="logo">EMS</h2>
            <nav>
                <ul className='main-menu'>
                    <li className='main-menu-item'>
                        <NavLink to="/" className={activeClass}>
                            <MdDashboard size={24} />
                            <span className='label font-semibold'>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className='main-menu-item'>
                        <NavLink to="/employees" className={activeClass}>
                            <MdPerson size={24} />
                            <span className='label font-semibold'>Employee</span>
                        </NavLink>
                    </li>
                    {authCtx.authUser?.role === AUTH_ROLES.ADMIN && (
                        <li className='main-menu-item'>
                            <NavLink to="/departments" className={activeClass}>
                                <FaUsers size={24} />
                                <span className='label font-semibold'>Departments</span>
                            </NavLink>
                        </li>
                    )}
                    {authCtx.authUser?.role === AUTH_ROLES.EMPLOYEE && (
                        <li className='main-menu-item'>
                            <a href='/' className="main-link space-x-4 items-center" onClick={(e) => toggleMenu(e, "attendance")}>
                                <div className='flex space-x-2'>
                                    <FaRegClock size={24} />
                                    <span className='label font-semibold'>Attendance</span>
                                </div>
                                <FaAngleDown size={22} />
                            </a>
                            <ul className={openMenu === "attendance" && themeCtx.isSidebarOpen ? 'block' : 'hidden'}>
                                <li>
                                    <NavLink to="/attendanceReport" className={activeClass}>
                                        <span className='ml-5'><FaClipboardCheck /></span>
                                        <span>Report</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/attendanceHistory" className={activeClass}>
                                        <span className='ml-5'><FaHistory /></span>
                                        <span>History</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </li>
                    )}
                    {authCtx.authUser?.role === AUTH_ROLES.ADMIN && (
                        <li className='main-menu-item'>
                            <NavLink to="/attendanceList" className={activeClass}>
                                <FaRegClock size={24} />
                                <span className='label font-semibold'>Attendances</span>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </aside>
    )
}

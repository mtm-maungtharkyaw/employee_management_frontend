import React from 'react'
import { NavLink } from 'react-router-dom'

// icons
import { MdDashboard, MdPerson } from "react-icons/md"
import { FaUsers, FaBriefcase } from "react-icons/fa6"

import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
    const themeCtx = useTheme()
    const authCtx = useAuth()

    const activeClass = ({ isActive }) => isActive ? 'space-x-2 active' : 'space-x-2'
    const sidebarClass = themeCtx.isSidebarOpen ? 'sidebar open' : 'sidebar'

    return (
        <aside className={sidebarClass}>
            <h2 className="logo">EMS</h2>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className={activeClass}>
                            <MdDashboard size={24} />
                            <span className='label font-semibold'>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/employees" className={activeClass}>
                            <MdPerson size={24} />
                            <span className='label font-semibold'>Employee</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/departments" className={activeClass}>
                            <FaUsers size={24} />
                            <span className='label font-semibold'>Departments</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

import React, { useState } from 'react'

// react router dom
import { Outlet } from 'react-router-dom';

// components
import Sidebar from './Sidebar'
import Header from './Header'
import '../styles/layout.css'

export default function Layout() {
    return (
        <div className="layout">
            <Sidebar/>
            <div className="main">
                <Header/>
                <div className="content overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

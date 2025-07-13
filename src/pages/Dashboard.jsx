import React from 'react'

// components
import Breadcrumbs from '../components/Breadcrumbs'

export default function Dashboard() {
    const breadcrumb_items = [{ label: 'Dashboard' }]
    return (
        <>
            <Breadcrumbs items={breadcrumb_items} />
        </>
    )
}

import { useEffect, useState } from 'react'

// components
import Breadcrumbs from '../../components/Breadcrumbs'

import { marked } from 'marked'

const BREADCRUMB_ITEMS = [{ label: "Announcements" }]

const Announcement = () => {
    useEffect(() => {

    }, [])

    return (
        <>

            {/* Breadcrumb */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            {/* <h3>Preview</h3>
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: marked(value) }}
      /> */}
        </>
    )
}

export default Announcement
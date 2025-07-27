import { useEffect, useState } from 'react'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

const BREADCRUMB_ITEMS = [{ label: "Announcements", to: "/announcement" }, { label: "Create" }]

const AnnouncementCreate = () => {
    const [value, setValue] = useState("")

    useEffect(() => {
        console.log(value)
    }, [value])
    return (
        <>
            {/* Breadcrumb */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <SimpleMDE value={value} onChange={setValue} className='border-none' />
                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2">POST</button>
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2">Cancel</button>
                </div>
            </div>
        </>
    )
}

export default AnnouncementCreate
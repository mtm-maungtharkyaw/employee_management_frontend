import { useEffect, useState } from 'react'

// react router dom
import { useNavigate } from 'react-router-dom'

// components
import Breadcrumbs from '../../components/Breadcrumbs'
import Loading from '../../components/common/Loading'

// editor
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

// axios instance
import axiosInstance from "../../api/axiosInstance"

// toastify
import { ToastContainer, toast } from 'react-toastify'

const BREADCRUMB_ITEMS = [{ label: "Announcements", to: "/announcement" }, { label: "Create" }]

const AnnouncementCreate = () => {
    const navigate = useNavigate()

    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const goToListPage = () => {
        navigate('/announcement')
    }

    const showToast = (type = "success", message) => {
        if (type === "success") {
            toast.success(message)
        } else if (type === "error") {
            toast.error(message)
        }
    }

    const postAnnouncement = async () => {
        if(content == '') return

        setIsLoading(true)
        try {
            await axiosInstance.post('/announcement/create', {
                content
            })
            showToast("success", "Successfully Posted")
            setTimeout(() => {
                goToListPage()
            }, 600)
        } catch (error) {
            console.error(error)
            if (error.response) {
                const message = error.response.data.message
                showToast("error", message)
            } else {
                console.log("reached this")
                showToast("error", "Something Went Wrong")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Breadcrumb */}
            <Breadcrumbs items={BREADCRUMB_ITEMS} />

            {/* Loading */}
            {isLoading && <Loading />}

            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className="rounded-sm border border-[#e6e5e5] bg-[#fefefe] p-5">
                <SimpleMDE value={content} onChange={setContent} />
                <div className="flex justify-end">
                    <button className="bg-soft-green btn text-white border-none mr-3 w-[120px] py-2" onClick={postAnnouncement}>POST</button>
                    <button className="bg-gray-500  btn text-white border-none w-[120px] py-2" onClick={goToListPage}>Cancel</button>
                </div>
            </div>
        </>
    )
}

export default AnnouncementCreate